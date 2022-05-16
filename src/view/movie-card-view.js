import AbstractView from '../framework/view/abstract-view.js';
import { createMovieCardTemplate } from '../templates/movie-card-template.js';

export default class MovieCardView extends AbstractView{
  #movie = null;

  constructor(movie) {
    super();
    this.#movie = movie;
  }

  get template() {
    return createMovieCardTemplate(this.#movie);
  }

  setClickHandler = (callback) => {
    this._callback.click = callback;
    this.element.querySelector('.film-card__link').addEventListener('click', this.#clickHandler);
  };

  #clickHandler = (evt) => {
    if (evt.target.closest('.film-card__link')) {
      evt.preventDefault();
      this._callback.click();
    }
  };
}
