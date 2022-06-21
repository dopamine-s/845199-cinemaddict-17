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
import { MOVIES_PER_STEP, SORT_TYPE, UPDATE_TYPE, USER_ACTION, FILTER_TYPE } from '../consts.js';
import { render, remove, RenderPosition } from '../framework/render.js';
import { filter } from '../utils/filter.js';

export default class FilmsPresenter {
  #filmsContainer = null;
  #moviesModel = null;
  #commentsModel = null;
  #filtersModel = null;
  #noMoviesComponent = null;
  #sortViewComponent = null;
  #showMoreButtonComponent = null;
  #renderedMoviesCount = MOVIES_PER_STEP;
  #openMoviePresenter = null;
  #scrollPosition = null;
  #moviePresenter = new Map();
  #currentSortType = SORT_TYPE.DEFAULT;
  #filterType = FILTER_TYPE.ALL;
  #isLoading = true;

  #filmsSectionComponent = new FilmsSectionView();
  #filmsListComponent = new FilmsListView();
  #loadingComponent = new LoadingView();
  #filmsContainerComponent = new FilmsContainerView();
  #filmsTopRatedContainerComponent = new FilmsContainerView();
  #filmsMostCommentedContainerComponent = new FilmsContainerView();
  #filmsTopRatedComponent = new FilmsTopRatedView();
  #filmsMostCommentedComponent = new FilmsMostCommentedView();

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

    switch (actionType) {
      case USER_ACTION.UPDATE:
        await this.#moviesModel.updateMovie(updateType, update);
        break;
      case USER_ACTION.ADD:
      case USER_ACTION.DELETE:
        this.#moviesModel.updateLocalMovie(updateType, update);
        break;
    }
  };

  #handleModelEvent = (updateType, movie) => {
    switch (updateType) {
      case UPDATE_TYPE.PATCH:
        this.#moviePresenter.get(movie.id).init(movie);
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
    this.#moviePresenter
      .forEach((value) => value
        .forEach((presenter) => presenter.resetView()));
    if (this.#openMoviePresenter) {
      this.#openMoviePresenter.resetView();
    }
  };


  #renderMovie = (movie, movieContainer) => {
    const moviePresenter = new MoviePresenter(
      movieContainer,
      this.#handleViewAction,
      this.#handleModeChange,
      this.#commentsModel
    );
    moviePresenter.init(movie);
    if (this.#moviePresenter.has(movie.id)) {
      this.#moviePresenter.get(movie.id).push(moviePresenter);
      return;
    }
    this.#moviePresenter.set(movie.id, [moviePresenter]);
  };

  #renderMovies = (movies) => {
    movies.forEach((movie) => this.#renderMovie(movie, this.#filmsContainerComponent.element ));
  };

  #renderTopRatedMovies = () => {
    const allMoviesRate = this.#moviesModel.topRatedMovies.map((movie) => parseFloat(movie.filmInfo.totalRating)).reduce((a, b) => a + b);
    if (allMoviesRate > 0) {
      render(this.#filmsTopRatedComponent, this.#filmsSectionComponent.element);
      render(this.#filmsTopRatedContainerComponent, this.#filmsTopRatedComponent.element);
      this.#moviesModel.topRatedMovies.forEach((movie) => this.#renderMovie(movie, this.#filmsTopRatedContainerComponent.element));
    }
  };

  #renderMostCommentedMovies = () => {
    const allCommentsCount = this.#moviesModel.mostCommentedMovies.map((movie) => movie.comments.length).reduce((a, b) => a + b);
    if (allCommentsCount > 0) {
      render(this.#filmsMostCommentedComponent, this.#filmsSectionComponent.element);
      render(this.#filmsMostCommentedContainerComponent, this.#filmsMostCommentedComponent.element);
      this.#moviesModel.mostCommentedMovies.forEach((movie) => this.#renderMovie(movie, this.#filmsMostCommentedContainerComponent.element));
    }
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

  #renderFilmsContainerComponent = () => {
    render(this.#filmsContainerComponent, this.#filmsListComponent.element);
  };

  #clearFilms = ({ resetRenderedMoviesCount = false, resetSortType = false } = {}) => {
    const moviesCount = this.movies.length;

    this.#scrollPosition = document.documentElement.scrollTop;

    this.#moviePresenter
      .forEach((presenters) =>
        presenters.forEach((presenter) => {
          if (presenter.isModeDetails()) {
            this.#openMoviePresenter = presenter;
            return presenter.movieCardDestroy();
          }
          presenter.destroy();
        })
      );
    this.#moviePresenter.clear();

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

  #updateOpenMoviePresenter = () => {
    if (!this.#openMoviePresenter) {
      return true;
    }

    if (!this.#openMoviePresenter.isModeDetails) {
      this.#openMoviePresenter = null;
    }

    const updateMovie = this.#moviesModel.movies.filter((movie) => movie.id === this.#openMoviePresenter.movie.id)[0];
    this.#openMoviePresenter.init(updateMovie);
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
    this.#renderTopRatedMovies();
    this.#renderMostCommentedMovies();

    this.#updateOpenMoviePresenter();
    this.#renderMovies(movies.slice(0, Math.min(moviesCount, this.#renderedMoviesCount)));

    if (moviesCount > this.#renderedMoviesCount) {
      this.#renderShowMoreButton();
    }

    if (this.#scrollPosition) {
      window.scrollTo(0, this.#scrollPosition);
    }
  };
}
