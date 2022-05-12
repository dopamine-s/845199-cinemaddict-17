import { createElement } from '../render.js';
import { createFilmsSectionTemplate } from '../templates/films-section-template.js';

export default class FilmsSectionView {
  #element = null;

  get template() {
    return createFilmsSectionTemplate();
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
