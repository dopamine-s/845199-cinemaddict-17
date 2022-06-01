import SortView from '../view/sort-view.js';
import FilmsSectionView from '../view/films-section-view.js';
import FilmsListView from '../view/films-list-view.js';
import FilmsContainerView from '../view/films-container-view.js';
import MoviePresenter from './movie-presenter.js';
import ShowMoreButtonView from '../view/show-more-button-view.js';
import FilmsTopRatedView from '../view/films-top-rated-view.js';
import FilmsMostCommentedView from '../view/films-most-commented-view.js';
import NoMoviesView from '../view/no-movies-view.js';
import {getCommentsByIds, sortMovieByDate, sortMovieByRating } from '../utils/utils.js';
import { SortType, UpdateType, UserAction } from '../consts.js';
import { render, remove } from '../framework/render.js';

const MOVIES_PER_STEP = 5;

export default class FilmsPresenter {
  #filmsContainer = null;
  #moviesModel = null;
  #renderedMoviesCount = MOVIES_PER_STEP;
  #moviePresenter = new Map();
  #currentSortType = SortType.DEFAULT;

  #noMoviesComponent = new NoMoviesView();
  #filmsSectionComponent = new FilmsSectionView();
  #filmsListComponent = new FilmsListView();
  #filmsContainerComponent = new FilmsContainerView();
  #filmsTopRatedComponent = new FilmsTopRatedView();
  #filmsMostCommentedComponent = new FilmsMostCommentedView();

  #sortViewComponent = null;
  #showMoreButtonComponent = null;

  constructor(filmsContainer, moviesModel) {
    this.#filmsContainer = filmsContainer;
    this.#moviesModel = moviesModel;

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

  get comments() {
    return this.#moviesModel.comments;
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

  // #onMovieChange = (updatedMovie, updatedComments) => {
  //   this.#moviePresenter.get(updatedMovie.id).init(updatedMovie, updatedComments);
  // };

  #handleViewAction = (actionType, updateType, update) => {
    // console.log(actionType, updateType, update);
    // Здесь будем вызывать обновление модели.
    // actionType - действие пользователя, нужно чтобы понять, какой метод модели вызвать
    // updateType - тип изменений, нужно чтобы понять, что после нужно обновить
    // update - обновленные данные
    switch (actionType) {
      case UserAction.UPDATE_MOVIE:
      case UserAction.ADD_COMMENT:
      case UserAction.DELETE_COMMENT:
        this.#moviesModel.updateMovie(updateType, update);
        break;
    }
  };

  #handleModelEvent = (updateType, data) => {
    // console.log(updateType, data);
    // В зависимости от типа изменений решаем, что делать:
    // - обновить часть списка (например, когда поменялось описание)
    // - обновить список
    // - обновить весь блок с фильмами
    switch (updateType) {
      case UpdateType.PATCH:
        this.#moviePresenter.get(data.id)
          .forEach((presenter) => presenter.init(data));
        break;
      case UpdateType.MINOR:
        this.#clearFilms();
        this.#renderFilms();
        break;
      case UpdateType.MAJOR:
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
    this.#moviePresenter.forEach((presenter) => presenter.resetView());
  };


  #renderMovie = (movie, comments, container) => {
    const moviePresenter = new MoviePresenter(container, this.#moviesModel, this.#handleViewAction, this.#handleModeChange);
    moviePresenter.init(movie, comments);
    this.#moviePresenter.set(movie.id, moviePresenter);
  };

  #renderMovies = (movies) => {
    const allComments = this.comments;
    movies.forEach((movie) => this.#renderMovie(movie, getCommentsByIds(allComments, movie.comments), this.#filmsContainerComponent.element));
  };

  #renderNoMoviesComponent = () => {
    render(this.#noMoviesComponent, this.#filmsContainer);
  };

  #renderSortViewComponent = () => {
    this.#sortViewComponent = new SortView(this.#currentSortType);
    this.#sortViewComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
    render(this.#sortViewComponent, this.#filmsContainer);
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

  // #clearMoviesList = () => {
  //   this.#moviePresenter.forEach((presenter) => presenter.destroy());
  //   this.#moviePresenter.clear();
  //   this.#renderedMoviesCount = MOVIES_PER_STEP;

  //   remove(this.#showMoreButtonComponent);
  // };

  // #renderMoviesList = () => {
  //   const moviesCount = this.movies.length;
  //   const movies = this.movies.slice(0,Math.min(moviesCount, MOVIES_PER_STEP));
  //   this.#renderMovies(movies);

  //   if (moviesCount > MOVIES_PER_STEP) {
  //     this.#renderShowMoreButton();
  //   }
  // };

  #clearFilms = ({ resetRenderedMoviesCount = false, resetSortType = false } = {}) => {
    const moviesCount = this.movies.length;

    this.#moviePresenter.forEach((presenter) => presenter.destroy());
    this.#moviePresenter.clear();

    remove(this.#sortViewComponent);
    remove(this.#filmsSectionComponent);
    remove(this.#filmsListComponent);
    remove(this.#filmsContainerComponent);
    remove(this.#filmsTopRatedComponent);
    remove(this.#filmsMostCommentedComponent);

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

    if (moviesCount === 0) {
      this.#renderNoMoviesComponent();
      return;
    }

    this.#renderSortViewComponent();
    this.#renderFilmsSectionComponent();
    this.#renderFilmsListComponent();
    this.#renderFilmsContainerComponent();

    this.#renderMovies(movies.slice(0, Math.min(moviesCount, this.#renderedMoviesCount)));

    if (moviesCount > this.#renderedMoviesCount) {
      this.#renderShowMoreButton();
    }

    this.#renderFilmsTopRatedComponent();
    this.#renderFilmsMostCommentedComponent();
  };
}
