import { createElement } from '../render.js';
import { createMovieDetailsTemplate } from '../templates/create-movie-details-template.js';

export default class MovieDetailsView {
  #element = null;
  #movie = null;
  #movieComments = null;

  constructor(movie, movieComments) {
    this.#movie = movie;
    this.#movieComments = movieComments;
  }

  get template() {
    return createMovieDetailsTemplate(this.#movie, this.#movieComments);
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  removeElement() {
    this.#element = null;
  }
}
