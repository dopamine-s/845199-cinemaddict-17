import { createElement } from '../render.js';
import { createFilmsTopRatedTemplate } from '../templates/films-top-rated-template.js';

export default class FilmsTopRatedView {
  #element = null;

  get template() {
    return createFilmsTopRatedTemplate();
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
