import { createElement } from '../render.js';
import { createMoviesAmountTemplate } from '../templates/movies-amount-template.js';

export default class MoviesAmountView {
  #element = null;
  #movies = null;

  constructor(movies) {
    this.#movies = movies;
    this.moviesAmount = this.#movies.length;
  }

  get template() {
    return createMoviesAmountTemplate(this.moviesAmount);
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
