import AbstractStatefulView from '../framework/view/abstract-view.js';
import { filtersTemplate } from '../templates/filters-template.js';

export default class FiltersView extends AbstractStatefulView {
  #filters = null;
  #currentFilter = null;
  constructor(filters, currentFilterType) {
    super();
    this.#filters = filters;
    this.#currentFilter = currentFilterType;
  }

  get template() {
    return filtersTemplate(this.#filters, this.#currentFilter);
  }

  setFilterTypeChangeHandler = (callback) => {
    this._callback.filterTypeChange = callback;
    this.element.addEventListener('click', this.#filterTypeChangeHandler);
    console.log(this.element);
  };

  #filterTypeChangeHandler = (evt) => {
    evt.preventDefault();
    this._callback.filterTypeChange(evt.target.dataset.filterType);
  };

  _restoreHandlers = () => {
    this.setFilterTypeChangeHandler(this._callback.filterTypeChange);
  };
}
