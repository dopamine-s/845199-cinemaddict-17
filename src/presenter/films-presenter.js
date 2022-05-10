import FilmsSectionView from '../view/films-section-view.js';
import FilmsListView from '../view/films-list-view.js';
import FilmsContainerView from '../view/films-container-view.js';
import MovieCardView from '../view/movie-card-view.js';
import ShowMoreButtonView from '../view/show-more-button-view.js';
import FilmsTopRatedView from '../view/films-top-rated-view.js';
import FilmsMostCommentedView from '../view/films-most-commented-view.js';
import {getCommentsByIds} from '../utils.js';
import { render } from '../render.js';

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

      render(new MovieCardView(
        singleMovie,
        movieComments
      ), this.#filmsContainerComponent.element);
    }

    render(new ShowMoreButtonView(), this.#filmsListComponent.element);
    render(new FilmsTopRatedView(), this.#filmsSectionComponent.element);
    render(new FilmsMostCommentedView(), this.#filmsSectionComponent.element);
  }
}
