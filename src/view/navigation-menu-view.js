import AbstractView from '../framework/view/abstract-view.js';
import { createNavigationMenuTemplate } from '../templates/navigation-menu-template.js';

export default class NavigationMenuView extends AbstractView {
  #filters = null;
  constructor(filters) {
    super();
    this.#filters = filters;
  }

  get template() {
    return createNavigationMenuTemplate(this.#filters);
  }
}
