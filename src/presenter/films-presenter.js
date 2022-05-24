import SortView from '../view/sort-view.js';
import FilmsSectionView from '../view/films-section-view.js';
import FilmsListView from '../view/films-list-view.js';
import FilmsContainerView from '../view/films-container-view.js';
import MoviePresenter from './movie-presenter.js';
import ShowMoreButtonView from '../view/show-more-button-view.js';
import FilmsTopRatedView from '../view/films-top-rated-view.js';
import FilmsMostCommentedView from '../view/films-most-commented-view.js';
import NoMoviesView from '../view/no-movies-view.js';
import {getCommentsByIds, updateItem, sortMovieByDate, sortMovieByRating } from '../utils/utils.js';
import { SortType } from '../consts.js';
import { render, remove } from '../framework/render.js';

const MOVIES_PER_STEP = 5;

export default class FilmsPresenter {
  #filmsContainer = null;
  #mockMoviesModel = null;
  #movies = [];
  #comments = [];
  #renderedMoviesCount = MOVIES_PER_STEP;
  #moviePresenter = new Map();
  #currentSortType = SortType.DEFAULT;
  #sourcedMovies = [];

  #noMoviesComponent = new NoMoviesView();
  #sortViewComponent = new SortView();
  #filmsSectionComponent = new FilmsSectionView();
  #filmsListComponent = new FilmsListView();
  #filmsContainerComponent = new FilmsContainerView();
  #showMoreButtonComponent = new ShowMoreButtonView();
  #filmsTopRatedComponent = new FilmsTopRatedView();
  #filmsMostCommentedComponent = new FilmsMostCommentedView();

  constructor(filmsContainer, mockMoviesModel) {
    this.#filmsContainer = filmsContainer;
    this.#mockMoviesModel = mockMoviesModel;
  }

  init = () => {
    this.#movies = [...this.#mockMoviesModel.mockMoviesData];
    this.#sourcedMovies = [...this.#mockMoviesModel.mockMoviesData];
    this.#comments = [...this.#mockMoviesModel.mockMoviesComments];

    this.#renderMoviesBlock();
  };

  #renderShowMoreButton = () => {
    render(this.#showMoreButtonComponent, this.#filmsListComponent.element);
    this.#showMoreButtonComponent.setClickHandler(this.#onShowMoreButtonComponentClick);
  };

  #onShowMoreButtonComponentClick = () => {
    this.#renderMovies(this.#renderedMoviesCount, this.#renderedMoviesCount + MOVIES_PER_STEP);
    this.#renderedMoviesCount += MOVIES_PER_STEP;

    if (this.#renderedMoviesCount >= this.#movies.length) {
      remove(this.#showMoreButtonComponent);
    }
  };

  #onMovieChange = (updatedMovie, comments) => {
    this.#movies = updateItem(this.#movies, updatedMovie);
    this.#sourcedMovies = updateItem(this.#sourcedMovies, updatedMovie);
    this.#moviePresenter.get(updatedMovie.id).init(updatedMovie, comments);
  };

  #sortMovies = (sortType) => {
    switch (sortType) {
      case SortType.DATE:
        this.#movies.sort(sortMovieByDate);
        break;
      case SortType.RATING:
        this.#movies.sort(sortMovieByRating);
        break;
      default:
        this.#movies = [...this.#sourcedMovies];
    }

    this.#currentSortType = sortType;
  };

  #onSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#sortMovies(sortType);
    this.#clearMoviesList();
    this.#renderMoviesList();
  };

  #onModeChange = () => {
    this.#moviePresenter.forEach((presenter) => presenter.resetView());
  };


  #renderMovie = (movie, comments, container) => {
    const moviePresenter = new MoviePresenter(container, this.#onMovieChange, this.#onModeChange);
    moviePresenter.init(movie, comments);
    this.#moviePresenter.set(movie.id, moviePresenter);
  };

  #renderMovies = (from, to) => {
    this.#movies.
      slice(from, to)
      .forEach((movie) => this.#renderMovie(movie, getCommentsByIds(this.#comments, movie.comments), this.#filmsContainerComponent.element));
  };

  #renderNoMoviesComponent = () => {
    render(this.#noMoviesComponent, this.#filmsContainer);
  };

  #renderSortViewComponent = () => {
    render(this.#sortViewComponent, this.#filmsContainer);
    this.#sortViewComponent.setSortTypeChangeHandler(this.#onSortTypeChange);
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

  #clearMoviesList = () => {
    this.#moviePresenter.forEach((presenter) => presenter.destroy());
    this.#moviePresenter.clear();
    this.#renderedMoviesCount = MOVIES_PER_STEP;

    remove(this.#showMoreButtonComponent);
  };

  #renderMoviesList = () => {
    this.#renderMovies(0, Math.min(this.#movies.length, MOVIES_PER_STEP));

    if (this.#movies.length > MOVIES_PER_STEP) {
      this.#renderShowMoreButton();
    }
  };

  #renderFilmsTopRatedComponent = () => {
    render(this.#filmsTopRatedComponent, this.#filmsSectionComponent.element);
  };

  #renderFilmsMostCommentedComponent = () => {
    render(this.#filmsMostCommentedComponent, this.#filmsSectionComponent.element);
  };

  #renderMoviesBlock = () => {
    if (!this.#movies.length) {
      this.#renderNoMoviesComponent();
      return;
    }

    this.#renderSortViewComponent();
    this.#renderFilmsSectionComponent();
    this.#renderFilmsListComponent();
    this.#renderFilmsContainerComponent();

    this.#renderMoviesList();

    this.#renderFilmsTopRatedComponent();
    this.#renderFilmsMostCommentedComponent();
  };
}
