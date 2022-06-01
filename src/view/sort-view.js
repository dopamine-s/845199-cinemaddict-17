import AbstractView from '../framework/view/abstract-view.js';
import { createSortTemplate } from '../templates/sort-template.js';

export default class SortView extends AbstractView {
  #currentSortType = null;

  constructor (currentSortType) {
    super();
    this.#currentSortType = currentSortType;
  }

  get template() {
    return createSortTemplate(this.#currentSortType);
  }

  setSortTypeChangeHandler = (callback) => {
    this._callback.sortTypeChange = callback;
    this.element.addEventListener('click', this.#sortTypeChangeHandler);
  };

  #sortTypeChangeHandler = (evt) => {
    evt.preventDefault();
    if (!evt.target.classList.contains('sort__button')) {
      return;
    }

    // this.element.querySelectorAll('.sort__button').forEach((item) => item.classList.remove('sort__button--active'));
    // evt.target.classList.add('sort__button--active');
    this._callback.sortTypeChange(evt.target.dataset.sortType);
  };
}
