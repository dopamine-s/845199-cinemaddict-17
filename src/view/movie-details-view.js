import AbstractView from '../framework/view/abstract-view.js';
import { createMovieDetailsTemplate } from '../templates/movie-details-template.js';

export default class MovieDetailsView extends AbstractView{
  #movie = null;
  #movieComments = null;

  constructor(movie, movieComments) {
    super();
    this.#movie = movie;
    this.#movieComments = movieComments;
  }

  get template() {
    return createMovieDetailsTemplate(this.#movie, this.#movieComments);
  }
}
