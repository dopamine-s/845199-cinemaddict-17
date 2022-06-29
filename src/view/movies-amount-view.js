import AbstractView from '../framework/view/abstract-view.js';
import { createMoviesAmountTemplate } from '../templates/movies-amount-template.js';

export default class MoviesAmountView extends AbstractView {
  #movies = null;

  constructor(movies) {
    super();
    this.#movies = movies;
    this.moviesAmount = this.#movies.length;
  }

  get template() {
    return createMoviesAmountTemplate(this.moviesAmount);
  }
}
