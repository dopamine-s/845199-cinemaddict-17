import AbstractView from '../framework/view/abstract-view.js';
import { createNavigationMenuTemplate } from '../templates/navigation-menu-template.js';

export default class NavigationMenuView extends AbstractView {
  #filters = null;
  #currentFilter = null;
  constructor(filters, currentFilterType) {
    super();
    this.#filters = filters;
    this.#currentFilter = currentFilterType;
  }

  get template() {
    return createNavigationMenuTemplate(this.#filters, this.#currentFilter);
  }

  setFilterTypeChangeHandler = (callback) => {
    this._callback.filterTypeChange = callback;
    this.element.addEventListener('change', this.#filterTypeChangeHandler);
  };

  #filterTypeChangeHandler = (evt) => {
    evt.preventDefault();
    this._callback.filterTypeChange(evt.target.value);
  };
}
