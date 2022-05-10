import MovieDetailsView from '../view/movie-details-view.js';
import { getCommentsByIds } from '../utils.js';
import { render } from '../render.js';

export default class MovieDetailsPresenter {
  #movieDetailsContainer = null;
  #mockMoviesModel = null;
  #movies = null;
  #comments = null;

  init(movieDetailsContainer, mockMoviesModel) {
    this.#movieDetailsContainer = movieDetailsContainer;
    this.#mockMoviesModel = mockMoviesModel;
    this.#movies = [...this.#mockMoviesModel.mockMoviesData];
    this.#comments = [...this.#mockMoviesModel.mockMoviesComments];


    const movieComments = getCommentsByIds(this.#comments, this.#movies[0].comments);

    render(new MovieDetailsView(
      this.#movies[0],
      movieComments
    ), this.#movieDetailsContainer);
  }
}
