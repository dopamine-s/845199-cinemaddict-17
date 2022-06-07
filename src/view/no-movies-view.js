import AbstractView from '../framework/view/abstract-view.js';
import { createNoMoviesTemplate } from '../templates/no-movies-template.js';

export default class NoMoviesView extends AbstractView {
  #filterType = null;

  constructor(filterType) {
    super();
    this.#filterType = filterType;
  }

  get template() {
    return createNoMoviesTemplate(this.#filterType);
  }
}
