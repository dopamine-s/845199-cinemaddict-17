import { createElement } from '../render.js';
import { createNavigationMenuTemplate } from '../templates/navigation-menu-template.js';

export default class NavigationMenuView {
  #element = null;

  get template() {
    return createNavigationMenuTemplate();
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
