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
import {getCommentsByIds} from '../utils.js';
import { render } from '../render.js';
import { isEscapeKey } from '../utils.js';

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

  constructor(filmsContainer, mockMoviesModel) {
    this.#filmsContainer = filmsContainer;
    this.#mockMoviesModel = mockMoviesModel;
  }

  init = () => {
    this.#movies = [...this.#mockMoviesModel.mockMoviesData];
    this.#comments = [...this.#mockMoviesModel.mockMoviesComments];

    this.#renderMovies();
  };

  #renderMovies() {
    if (!this.#movies.length) {
      render(this.#noMoviesComponent, this.#filmsContainer);
    }

    render(this.#sortViewComponent, this.#filmsContainer);
    render(this.#filmsSectionComponent, this.#filmsContainer);
    render(this.#filmsListComponent, this.#filmsSectionComponent.element);
    render(this.#filmsContainerComponent, this.#filmsListComponent.element);

    for (let i = 0; i < Math.min(this.#movies.length, MOVIES_PER_STEP); i++) {
      this.#renderMovie(
        this.#movies[i],
        getCommentsByIds(this.#comments, this.#movies[i].comments),
        this.#filmsContainerComponent.element
      );
    }

    if (this.#movies.length > MOVIES_PER_STEP) {
      render(this.#showMoreButtonComponent, this.#filmsListComponent.element);

      this.#showMoreButtonComponent.element.addEventListener('click', this.#onShowMoreButtonComponentClick.bind(this));
    }

    render(new FilmsTopRatedView(), this.#filmsSectionComponent.element);
    render(new FilmsMostCommentedView(), this.#filmsSectionComponent.element);
  }

  #onShowMoreButtonComponentClick(evt) {
    evt.preventDefault();
    this.#movies
      .slice(this.#renderedMoviesCount, this.#renderedMoviesCount + MOVIES_PER_STEP)
      .forEach((singleMovie) => this.#renderMovie(singleMovie, getCommentsByIds(this.#comments, singleMovie.comments), this.#filmsContainerComponent.element));

    this.#renderedMoviesCount += MOVIES_PER_STEP;

    if (this.#renderedMoviesCount >= this.#movies.length) {
      this.#showMoreButtonComponent.element.remove();
      this.#showMoreButtonComponent.removeElement();
    }
  }

  #closeDetailsView = () => {
    if(!this.#movieDetailsComponent) {
      return;
    }
    this.#movieDetailsComponent.element.remove();
    this.#movieDetailsComponent.removeElement();
    document.body.classList.remove('hide-overflow');
    document.removeEventListener('keydown', this.#onEscapeKeyDown);
  };

  #onEscapeKeyDown = (evt) => {
    if (isEscapeKey(evt)) {
      evt.preventDefault();
      this.#closeDetailsView();
    }
  };

  #renderMovieDetails(movie, comments) {
    this.#movieDetailsComponent = new MovieDetailsView(movie, comments);
    render(this.#movieDetailsComponent, siteFooterElement, 'afterend');
    this.#movieDetailsComponent.element.querySelector('.film-details__close-btn').addEventListener('click', this.#closeDetailsView);
  }

  #renderMovie(movie, comments, container) {
    const movieCardComponent = new MovieCardView(movie, comments);
    render(movieCardComponent, container);

    const onMovieCardClick = (evt) => {
      if (this.#movieDetailsComponent) {
        this.#closeDetailsView();
      }
      if (evt.target.closest('.film-card__link')) {
        this.#renderMovieDetails(movie, comments);
      }

      document.body.classList.add('hide-overflow');
      document.addEventListener('keydown', this.#onEscapeKeyDown);
    };

    movieCardComponent.element.querySelector('.film-card__link').addEventListener('click', onMovieCardClick);
  }
}
