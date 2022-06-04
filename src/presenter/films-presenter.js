import SortView from '../view/sort-view.js';
import FilmsSectionView from '../view/films-section-view.js';
import FilmsListView from '../view/films-list-view.js';
import FilmsContainerView from '../view/films-container-view.js';
import ShowMoreButtonView from '../view/show-more-button-view.js';
import FilmsTopRatedView from '../view/films-top-rated-view.js';
import FilmsMostCommentedView from '../view/films-most-commented-view.js';
import NoMoviesView from '../view/no-movies-view.js';
import MoviePresenter from './movie-presenter.js';
import { sortMovieByDate, sortMovieByRating } from '../utils/utils.js';
import { MOVIES_PER_STEP, SortType, UPDATE_TYPE, USER_ACTION } from '../consts.js';
import { render, remove, RenderPosition } from '../framework/render.js';

export default class FilmsPresenter {
  #filmsContainer = null;
  #moviesModel = null;
  #commentsModel = null;
  #noMoviesComponent = null;
  #sortViewComponent = null;
  #showMoreButtonComponent = null;
  #renderedMoviesCount = MOVIES_PER_STEP;
  #moviePresenters = new Map();
  #currentSortType = SortType.DEFAULT;

  #filmsSectionComponent = new FilmsSectionView();
  #filmsListComponent = new FilmsListView();
  #filmsContainerComponent = new FilmsContainerView();
  #filmsTopRatedComponent = new FilmsTopRatedView();
  #filmsMostCommentedComponent = new FilmsMostCommentedView();

  constructor(filmsContainer, moviesModel, commentsModel) {
    this.#filmsContainer = filmsContainer;
    this.#moviesModel = moviesModel;
    this.#commentsModel = commentsModel;

    this.#moviesModel.addObserver(this.#handleModelEvent);
  }

  get movies() {
    switch (this.#currentSortType) {
      case SortType.DATE:
        return [...this.#moviesModel.movies].sort(sortMovieByDate);
      case SortType.RATING:
        return [...this.#moviesModel.movies].sort(sortMovieByRating);
    }

    return this.#moviesModel.movies;
  }

  init = () => {
    this.#renderFilms();
  };

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

  #handleViewAction = (actionType, updateType, update) => {
    switch (actionType) {
      case USER_ACTION.UPDATE:
        this.#moviesModel.updateMovie(updateType, update);
        break;
      case USER_ACTION.ADD:
        this.#moviesModel.addMovie(updateType, update);
        break;
      case USER_ACTION.DELETE:
        this.#moviesModel.deleteMovie(updateType, update);
        break;
    }
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


  #renderMovie = (movie) => {
    const moviePresenter = new MoviePresenter(this.#filmsContainerComponent.element, this.#handleViewAction, this.#handleModeChange, this.#commentsModel);
    moviePresenter.init(movie);
    this.#moviePresenters.set(movie.id, moviePresenter);
  };

  #renderMovies = (movies) => {
    movies.forEach((movie) => this.#renderMovie(movie));
  };

  #renderNoMoviesComponent = () => {
    this.#noMoviesComponent = new NoMoviesView();
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

    this.#moviePresenters.forEach((presenter) => presenter.destroy());
    this.#moviePresenters.clear();

    remove(this.#sortViewComponent);
    // remove(this.#filmsSectionComponent);
    // remove(this.#filmsListComponent);
    // remove(this.#filmsContainerComponent);
    // remove(this.#filmsTopRatedComponent);
    // remove(this.#filmsMostCommentedComponent);

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
      this.#currentSortType = SortType.DEFAULT;
    }
  };

  #renderFilmsTopRatedComponent = () => {
    render(this.#filmsTopRatedComponent, this.#filmsSectionComponent.element);
  };

  #renderFilmsMostCommentedComponent = () => {
    render(this.#filmsMostCommentedComponent, this.#filmsSectionComponent.element);
  };

  #renderFilms = () => {
    const movies = this.movies;
    const moviesCount = movies.length;

    this.#renderFilmsSectionComponent();
    this.#renderFilmsListComponent();

    if (moviesCount === 0) {
      this.#renderNoMoviesComponent();
      return;
    }

    this.#renderSortViewComponent();
    this.#renderFilmsContainerComponent();
    this.#renderMovies(movies.slice(0, Math.min(moviesCount, this.#renderedMoviesCount)));

    if (moviesCount > this.#renderedMoviesCount) {
      this.#renderShowMoreButton();
    }

    this.#renderFilmsTopRatedComponent();
    this.#renderFilmsMostCommentedComponent();
  };
}
