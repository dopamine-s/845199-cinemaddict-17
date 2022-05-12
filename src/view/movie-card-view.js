import { createElement } from '../render.js';
import { createMovieCardTemplate } from '../templates/movie-card-template.js';

export default class MovieCardView {
  #element = null;
  #movie = null;

  constructor(movie) {
    this.#movie = movie;
  }

  get template() {
    return createMovieCardTemplate(this.#movie);
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
