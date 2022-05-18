import SortView from '../view/sort-view.js';
import FilmsSectionView from '../view/films-section-view.js';
import FilmsListView from '../view/films-list-view.js';
import FilmsContainerView from '../view/films-container-view.js';
import MovieCardView from '../view/movie-card-view.js';
import ShowMoreButtonView from '../view/show-more-button-view.js';
import FilmsTopRatedView from '../view/films-top-rated-view.js';
import FilmsMostCommentedView from '../view/films-most-commented-view.js';
import MovieDetailsView from '../view/movie-details-view.js';
import NoMoviesView from '../view/no-movies-view.js';
import {getCommentsByIds} from '../utils/utils.js';
import { render, remove, RenderPosition } from '../framework/render.js';
import { isEscapeKey } from '../utils/utils.js';

const MOVIES_PER_STEP = 5;

const siteFooterElement = document.querySelector('.footer');

export default class FilmsPresenter {
  #filmsContainer = null;
  #mockMoviesModel = null;
  #movies = [];
  #comments = [];
  #renderedMoviesCount = MOVIES_PER_STEP;
  #movieDetailsComponent = null;

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

  #closeDetailsView = () => {
    if(!this.#movieDetailsComponent) {
      return;
    }
    remove(this.#movieDetailsComponent);
    document.body.classList.remove('hide-overflow');
    document.removeEventListener('keydown', this.#onEscapeKeyDown);
  };

  #onEscapeKeyDown = (evt) => {
    if (isEscapeKey(evt)) {
      evt.preventDefault();
      this.#closeDetailsView();
    }
  };

  #renderMovieDetails = (movie, comments) => {
    this.#movieDetailsComponent = new MovieDetailsView(movie, comments);
    render(this.#movieDetailsComponent, siteFooterElement, RenderPosition.AFTEREND);
    this.#movieDetailsComponent.setClickHandler(this.#closeDetailsView);
  };

  #renderMovie = (movie, comments, container) => {
    const movieCardComponent = new MovieCardView(movie, comments);
    render(movieCardComponent, container);

    const onMovieCardClick = () => {
      if (this.#movieDetailsComponent) {
        this.#closeDetailsView();
      }

      this.#renderMovieDetails(movie, comments);

      document.body.classList.add('hide-overflow');
      document.addEventListener('keydown', this.#onEscapeKeyDown);
    };

    movieCardComponent.setClickHandler(onMovieCardClick);
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
