import { createElement } from '../render.js';
import { createNoMoviesTemplate } from '../templates/no-movies-template.js';

export default class NoMoviesView {
  #element = null;

  get template() {
    return createNoMoviesTemplate();
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
