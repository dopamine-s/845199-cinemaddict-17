import { createElement } from '../render.js';
import { createFilmsMostCommentedTemplate } from '../templates/films-most-commented-template.js';

export default class FilmsMostCommentedView {
  #element = null;

  get template() {
    return createFilmsMostCommentedTemplate();
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
