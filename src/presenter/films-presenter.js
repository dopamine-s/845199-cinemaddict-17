import FilmsSectionView from '../view/films-section-view.js';
import FilmsListView from '../view/films-list-view.js';
import FilmsContainerView from '../view/films-container-view.js';
import MovieCardView from '../view/movie-card-view.js';
import ShowMoreButtonView from '../view/show-more-button-view.js';
import FilmsTopRatedView from '../view/films-top-rated-view.js';
import FilmsMostCommentedView from '../view/films-most-commented-view.js';
import MovieDetailsView from '../view/movie-details-view.js';
import {getCommentsByIds} from '../utils.js';
import { render } from '../render.js';
import { isEscapeKey } from '../utils.js';

const siteFooterElement = document.querySelector('.footer');

export default class FilmsPresenter {
  #filmsContainer = null;
  #mockMoviesModel = null;
  #movies = null;
  #comments = null;


  #filmsSectionComponent = new FilmsSectionView();
  #filmsListComponent = new FilmsListView();
  #filmsContainerComponent = new FilmsContainerView();

  init(filmsContainer, mockMoviesModel) {
    this.#filmsContainer = filmsContainer;
    this.#mockMoviesModel = mockMoviesModel;
    this.#movies = [...this.#mockMoviesModel.mockMoviesData];
    this.#comments = [...this.#mockMoviesModel.mockMoviesComments];

    render(this.#filmsSectionComponent, this.#filmsContainer);
    render(this.#filmsListComponent, this.#filmsSectionComponent.element);
    render(this.#filmsContainerComponent, this.#filmsListComponent.element);

    for (const singleMovie of this.#movies) {
      const movieComments = getCommentsByIds(this.#comments, singleMovie.comments);

      this.#renderMovie(
        singleMovie,
        movieComments,
        this.#filmsContainerComponent.element
      );
    }

    render(new ShowMoreButtonView(), this.#filmsListComponent.element);
    render(new FilmsTopRatedView(), this.#filmsSectionComponent.element);
    render(new FilmsMostCommentedView(), this.#filmsSectionComponent.element);
  }

  #renderMovie = (movie, comments, container) => {
    let movieDetailsComponent = null;

    const movieCardComponent = new MovieCardView(movie, comments);
    render(movieCardComponent, container);

    const onEscapeKeyDown = (evt)=> {
      if(isEscapeKey(evt)) {
        evt.preventDefault();
        movieDetailsComponent.element.remove();
        movieDetailsComponent.removeElement();
        document.body.classList.remove('hide-overflow');
        document.removeEventListener('keydown', onEscapeKeyDown);
      }
    };

    const onMovieDetailsCloseButtonClick = () => {
      movieDetailsComponent.element.remove();
      movieDetailsComponent.removeElement();
      document.body.classList.remove('hide-overflow');
      document.removeEventListener('keydown', onEscapeKeyDown);
    };

    const onMovieCardClick = (evt) => {
      if (evt.target.closest('.film-card__link')) {

        movieDetailsComponent = new MovieDetailsView(movie, comments);
        render(movieDetailsComponent, siteFooterElement, 'afterend');
        movieDetailsComponent.element.querySelector('.film-details__close-btn').addEventListener('click', onMovieDetailsCloseButtonClick);
      }

      document.body.classList.add('hide-overflow');
      document.addEventListener('keydown', onEscapeKeyDown);
    };

    movieCardComponent.element.querySelector('.film-card__link').addEventLstener('click', onMovieCardClick);
  };
}
