import AbstractView from '../framework/view/abstract-view.js';
import { createMovieDetailsTemplate } from '../templates/movie-details-template.js';

export default class MovieDetailsView extends AbstractView{
  #movie = null;
  #movieComments = null;

  constructor(movie, movieComments) {
    super();
    this.#movie = movie;
    this.#movieComments = movieComments;
  }

  get template() {
    return createMovieDetailsTemplate(this.#movie, this.#movieComments);
  }

  setClickHandler = (callback) => {
    this._callback.click = callback;
    this.element.querySelector('.film-details__close-btn').addEventListener('click', this.#clickHandler);
  };

  #clickHandler = (evt) => {
    evt.preventDefault();
    this._callback.click();
  };
}
