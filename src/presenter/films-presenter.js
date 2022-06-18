import SortView from '../view/sort-view.js';
import FilmsSectionView from '../view/films-section-view.js';
import FilmsListView from '../view/films-list-view.js';
import FilmsContainerView from '../view/films-container-view.js';
import ShowMoreButtonView from '../view/show-more-button-view.js';
import FilmsTopRatedView from '../view/films-top-rated-view.js';
import FilmsMostCommentedView from '../view/films-most-commented-view.js';
import NoMoviesView from '../view/no-movies-view.js';
import LoadingView from '../view/loading-view.js';
import MoviePresenter from './movie-presenter.js';
import { sortMovieByDate, sortMovieByRating } from '../utils/utils.js';
import { MOVIES_PER_STEP, TOP_RATED_MOVIES_AMOUNT, MOST_COMMENTED_MOVIES_AMOUNT, SORT_TYPE, UPDATE_TYPE, USER_ACTION, FILTER_TYPE } from '../consts.js';
import { render, remove, RenderPosition } from '../framework/render.js';
import { filter } from '../utils/filter.js';
import UiBlocker from '../framework/ui-blocker/ui-blocker.js';

const TimeLimit = {
  LOWER_LIMIT: 350,
  UPPER_LIMIT: 1000,
};

export default class FilmsPresenter {
  #filmsContainer = null;
  #moviesModel = null;
  #commentsModel = null;
  #filtersModel = null;
  #noMoviesComponent = null;
  #sortViewComponent = null;
  #showMoreButtonComponent = null;
  #renderedMoviesCount = MOVIES_PER_STEP;
  #moviePresenters = new Map();
  #currentSortType = SORT_TYPE.DEFAULT;
  #filterType = FILTER_TYPE.ALL;
  #isLoading = true;
  #topRatedMovies = null;
  #mostCommentedMovies = null;

  #filmsSectionComponent = new FilmsSectionView();
  #filmsListComponent = new FilmsListView();
  #loadingComponent = new LoadingView();
  #filmsContainerComponent = new FilmsContainerView();
  #filmsTopRatedContainerComponent = new FilmsContainerView();
  #filmsMostCommentedContainerComponent = new FilmsContainerView();
  #filmsTopRatedComponent = new FilmsTopRatedView();
  #filmsMostCommentedComponent = new FilmsMostCommentedView();
  #uiBlocker = new UiBlocker(TimeLimit.LOWER_LIMIT, TimeLimit.UPPER_LIMIT);

  constructor(filmsContainer, moviesModel, commentsModel, filtersModel) {
    this.#filmsContainer = filmsContainer;
    this.#moviesModel = moviesModel;
    this.#commentsModel = commentsModel;
    this.#filtersModel = filtersModel;

    this.#moviesModel.addObserver(this.#handleModelEvent);
    this.#filtersModel.addObserver(this.#handleModelEvent);
  }

  get movies() {
    this.#filterType = this.#filtersModel.filter;
    const movies = this.#moviesModel.movies;
    const filteredMovies = filter[this.#filterType](movies);

    switch (this.#currentSortType) {
      case SORT_TYPE.DATE:
        return [...filteredMovies].sort(sortMovieByDate);
      case SORT_TYPE.RATING:
        return [...filteredMovies].sort(sortMovieByRating);
    }

    return filteredMovies;
  }

  #getTopRatedMovies() {
    if (!this.#topRatedMovies) {
      this.#topRatedMovies = [...this.movies]
        .sort((a, b) => b.filmInfo.totalRating - a.filmInfo.totalRating)
        .slice(0, Math.min(this.movies.length, TOP_RATED_MOVIES_AMOUNT));
    }

    return this.#topRatedMovies;
  }

  #getMostCommentedMovies() {
    if (!this.#mostCommentedMovies) {
      this.#mostCommentedMovies = [...this.movies]
        .sort((a, b) => b.comments.length - a.comments.length)
        .slice(0, Math.min(this.movies.length, MOST_COMMENTED_MOVIES_AMOUNT));
    }

    return this.#mostCommentedMovies;
  }

  init() {
    this.#renderFilms();
  }

  #renderShowMoreButton = () => {
    this.#showMoreButtonComponent = new ShowMoreButtonView();
    this.#showMoreButtonComponent.setClickHandler(this.#handleShowMoreButtonComponentClick);
    render(this.#showMoreButtonComponent, this.#filmsListComponent.element);
  };

  #handleShowMoreButtonComponentClick = () => {
    const moviesCount = this.movies.length;
    const newRenderedMoviesCount = Math.min(moviesCount, this.#renderedMoviesCount + MOVIES_PER_STEP);
    const movies = this.movies.slice(this.#renderedMoviesCount, newRenderedMoviesCount);

    this.#renderMovies(movies);
    this.#renderedMoviesCount = newRenderedMoviesCount;

    if (this.#renderedMoviesCount >= moviesCount) {
      remove(this.#showMoreButtonComponent);
    }
  };

  #handleViewAction = async (actionType, updateType, update) => {
    this.#uiBlocker.block();

    switch (actionType) {
      case USER_ACTION.UPDATE:
        this.#moviesModel.updateMovie(updateType, update);
        break;
      case USER_ACTION.ADD:
        update.setViewAction();
        try {
          await this.#moviesModel.updateMovie(updateType, update);
        } catch (err) {
          update.setAborting();
        }
        break;
      case USER_ACTION.DELETE:
        update.setViewAction();
        try {
          await this.#moviesModel.updateMovie(updateType, update);
        } catch (err) {
          update.setAborting();
        }
        break;
    }
    this.#uiBlocker.unblock();
  };

  #handleModelEvent = (updateType, movie) => {
    switch (updateType) {
      case UPDATE_TYPE.PATCH:
        this.#moviePresenters.get(movie.id).init(movie);
        break;
      case UPDATE_TYPE.MINOR:
        this.#clearFilms();
        this.#renderFilms();
        break;
      case UPDATE_TYPE.MAJOR:
        this.#clearFilms({ resetRenderedMoviesCount: true, resetSortType: true });
        this.#renderFilms();
        break;
      case UPDATE_TYPE.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.#renderFilms();
        break;
    }
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#clearFilms({resetRenderedMoviesCount: true});
    this.#renderFilms();
  };

  #handleModeChange = () => {
    this.#moviePresenters.forEach((presenter) => presenter.resetView());
  };


  #renderMovie = (movie, movieContainer) => {
    const moviePresenter = new MoviePresenter(
      movieContainer,
      this.#handleViewAction,
      this.#handleModeChange,
      this.#commentsModel
    );
    moviePresenter.init(movie);
    this.#moviePresenters.set(movie.id, moviePresenter);
  };

  #renderMovies = (movies) => {
    movies.forEach((movie) => this.#renderMovie(movie, this.#filmsContainerComponent.element ));
  };

  #renderTopRatedMovies = (movies) => {
    this.#getTopRatedMovies(movies).forEach((movie) => this.#renderMovie(movie, this.#filmsTopRatedContainerComponent.element));
  };

  #renderMostCommentedMovies = (movies) => {
    this.#getMostCommentedMovies(movies).forEach((movie) => this.#renderMovie(movie, this.#filmsMostCommentedContainerComponent.element));
  };

  #renderLoadingComponent = () => {
    render(this.#loadingComponent, this.#filmsListComponent.element);
  };

  #renderNoMoviesComponent = () => {
    this.#noMoviesComponent = new NoMoviesView(this.#filterType);
    render(this.#noMoviesComponent, this.#filmsContainer);
  };

  #renderSortViewComponent = () => {
    this.#sortViewComponent = new SortView(this.#currentSortType);
    this.#sortViewComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
    render(this.#sortViewComponent, this.#filmsSectionComponent.element, RenderPosition.BEFOREBEGIN);
  };

  #renderFilmsSectionComponent = () => {
    render(this.#filmsSectionComponent, this.#filmsContainer);
  };

  #renderFilmsListComponent = () => {
    render(this.#filmsListComponent, this.#filmsSectionComponent.element);
  };

  #renderFilmsTopRatedComponent = () => {
    render(this.#filmsTopRatedComponent, this.#filmsSectionComponent.element);
  };

  #renderFilmsMostCommentedComponent = () => {
    render(this.#filmsMostCommentedComponent, this.#filmsSectionComponent.element);
  };

  #renderFilmsContainerComponent = () => {
    render(this.#filmsContainerComponent, this.#filmsListComponent.element);
  };

  #renderFilmsTopRatedContainerComponent = () => {
    render(this.#filmsTopRatedContainerComponent, this.#filmsTopRatedComponent.element);
  };

  #renderFilmsMostCommentedContainerComponent = () => {
    render(this.#filmsMostCommentedContainerComponent, this.#filmsMostCommentedComponent.element);
  };

  #clearFilms = ({ resetRenderedMoviesCount = false, resetSortType = false } = {}) => {
    const moviesCount = this.movies.length;

    this.#moviePresenters.forEach((presenter) => presenter.destroy());
    this.#moviePresenters.clear();

    remove(this.#sortViewComponent);
    remove(this.#filmsSectionComponent);
    remove(this.#filmsListComponent);
    remove(this.#loadingComponent);
    remove(this.#filmsTopRatedComponent);
    remove(this.#filmsMostCommentedComponent);
    remove(this.#filmsContainerComponent);
    remove(this.#filmsTopRatedContainerComponent);
    remove(this.#filmsMostCommentedContainerComponent);
    remove(this.#showMoreButtonComponent);

    if (this.#noMoviesComponent) {
      remove(this.#noMoviesComponent);
    }

    if (resetRenderedMoviesCount) {
      this.#renderedMoviesCount = MOVIES_PER_STEP;
    } else {
      this.#renderedMoviesCount = Math.min(moviesCount, this.#renderedMoviesCount);
    }

    if (resetSortType) {
      this.#currentSortType = SORT_TYPE.DEFAULT;
    }
  };

  #renderFilms = () => {
    const movies = this.movies;
    const moviesCount = movies.length;

    this.#renderFilmsSectionComponent();
    this.#renderFilmsListComponent();

    if (this.#isLoading) {
      this.#renderLoadingComponent();
      return;
    }

    if (moviesCount === 0) {
      this.#renderNoMoviesComponent();
      return;
    }

    this.#renderSortViewComponent();
    this.#renderFilmsContainerComponent();
    this.#renderFilmsTopRatedComponent();
    this.#renderFilmsTopRatedContainerComponent();
    this.#renderTopRatedMovies();
    this.#renderFilmsMostCommentedComponent();
    this.#renderFilmsMostCommentedContainerComponent();
    this.#renderMostCommentedMovies();

    this.#renderMovies(movies.slice(0, Math.min(moviesCount, this.#renderedMoviesCount)));

    if (moviesCount > this.#renderedMoviesCount) {
      this.#renderShowMoreButton();
    }
  };
}
