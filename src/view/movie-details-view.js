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

  setCloseDetailsClickHandler = (callback) => {
    this._callback.closeDetailsClick = callback;
    this.element.querySelector('.film-details__close-btn').addEventListener('click', this.#closeDetailsClickHandler);
  };

  setWatchlistClickHandler = (callback) => {
    this._callback.watchlistClick = callback;
    this.element.querySelector('.film-details__control-button--watchlist').addEventListener('click', this.#watchlistClickHandler);
  };

  setAlreadyWatchedClickHandler = (callback) => {
    this._callback.alreadyWatchedClick = callback;
    this.element.querySelector('.film-details__control-button--watched').addEventListener('click', this.#alreadyWatchedClickHandler);
  };

  setFavoriteClickHandler = (callback) => {
    this._callback.favoriteClick = callback;
    this.element.querySelector('.film-details__control-button--favorite').addEventListener('click', this.#favoriteClickHandler);
  };

  #closeDetailsClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.closeDetailsClick(this.#movie, this.#movieComments);
  };

  #watchlistClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.watchlistClick();
  };

  #alreadyWatchedClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.alreadyWatchedClick();
  };

  #favoriteClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.favoriteClick();
  };
}
