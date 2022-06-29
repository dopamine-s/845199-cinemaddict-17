import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { createMovieCardTemplate } from '../templates/movie-card-template.js';

export default class MovieCardView extends AbstractStatefulView{

  constructor(movie) {
    super();
    this._state = this.#convertMovieToState(movie);
  }

  get template() {
    return createMovieCardTemplate(this._state);
  }

  #convertMovieToState = (movie) => ({
    ...movie,
    isDisabled: false,
  });

  _restoreHandlers = () => {
    this.setDetailsClickHandler(this._callback.click);
    this.setWatchlistClickHandler(this._callback.watchlistClick);
    this.setAlreadyWatchedClickHandler(this._callback.alreadyWatchedClick);
    this.setFavoriteClickHandler(this._callback.favoriteClick);
  };

  setDetailsClickHandler = (callback) => {
    this._callback.click = callback;
    this.element.querySelector('.film-card__link').addEventListener('click', this.#detailsClickHandler);
  };

  setWatchlistClickHandler = (callback) => {
    this._callback.watchlistClick = callback;
    this.element.querySelector('.film-card__controls-item--add-to-watchlist').addEventListener('click', this.#watchlistClickHandler);
  };

  setAlreadyWatchedClickHandler = (callback) => {
    this._callback.alreadyWatchedClick = callback;
    this.element.querySelector('.film-card__controls-item--mark-as-watched').addEventListener('click', this.#alreadyWatchedClickHandler);
  };

  setFavoriteClickHandler = (callback) => {
    this._callback.favoriteClick = callback;
    this.element.querySelector('.film-card__controls-item--favorite').addEventListener('click', this.#favoriteClickHandler);
  };

  #detailsClickHandler = (evt) => {
    evt.preventDefault();
    document.body.classList.add('hide-overflow');
    this._callback.click();
  };

  #watchlistClickHandler = (evt) => {
    evt.preventDefault();
    this.updateElement({
      isDisabled: true,
    });
    this._callback.watchlistClick();
  };

  #alreadyWatchedClickHandler = (evt) => {
    evt.preventDefault();
    this.updateElement({
      isDisabled: true,
    });
    this._callback.alreadyWatchedClick();
  };

  #favoriteClickHandler = (evt) => {
    evt.preventDefault();
    this.updateElement({
      isDisabled: true,
    });
    this._callback.favoriteClick();
  };
}
