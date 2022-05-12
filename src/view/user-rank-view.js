import { createElement } from '../render.js';
import { createUserRankTemplate } from '../templates/user-rank-template.js';

export default class UserRankView {
  #element = null;

  get template() {
    return createUserRankTemplate();
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
