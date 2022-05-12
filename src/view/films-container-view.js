import { createElement } from '../render.js';
import { createFilmsContainerTemplate } from '../templates/films-container-template.js';

export default class FilmsContainerView {
  #element = null;

  get template() {
    return createFilmsContainerTemplate();
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
