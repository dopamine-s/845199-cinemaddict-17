import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { createMovieDetailsTemplate } from '../templates/movie-details-template.js';

export default class MovieDetailsView extends AbstractStatefulView {
  #movieComments = null;

  constructor(movie, movieComments) {
    super();
    this._state = MovieDetailsView.convertMovieToState(movie);
    this.#movieComments = movieComments;

    this.#setInnerHandlers();
  }

  get template() {
    return createMovieDetailsTemplate(this._state, this.#movieComments);
  }

  reset = (movie) => {
    this.updateElement(
      MovieDetailsView.convertMovieToState(movie),
    );
  };

  static convertMovieToState = (movie) => ({
    ...movie,
    commentEmoji: null,
    commentText: null,
    scrollTop: null
  });

  static convertStateToMovie = (state) => {
    const movie = { ...state };

    delete movie.commentEmoji;
    delete movie.commentText;
    delete movie.scrollTop;

    return movie;
  };

  #commentEmojiListHandler = (evt) => {
    const emojiInputItem = evt.target.closest('.film-details__emoji-item');
    if (emojiInputItem) {
      evt.preventDefault();
      this.updateElement({
        commentEmoji: emojiInputItem.value,
        scrollTop: this.element.scrollTop
      });
    }
    this.#restorePosition();
  };

  #commentInputHandler = (evt) => {
    evt.preventDefault();
    this._setState({
      commentText: evt.target.value,
      scrollTop: this.element.scrollTop
    });
    this.#restorePosition();
  };

  #restorePosition = () => {
    this.element.scrollTop = this._state.scrollTop;
  };

  _restoreHandlers = () => {
    this.#setInnerHandlers();
    this.#setOuterHandlers();
  };

  #setInnerHandlers = () => {
    this.element.querySelectorAll('.film-details__emoji-item').forEach((element) => element.addEventListener('change', this.#commentEmojiListHandler));
    this.element.querySelector('.film-details__comment-input').addEventListener('input', this.#commentInputHandler);
  };

  #setOuterHandlers = () => {
    this.setDeleteCommentClickHandler(this._callback.deleteCommentClick);
    this.setCloseDetailsClickHandler(this._callback.closeDetailsClick);
    this.setWatchlistClickHandler(this._callback.watchlistClick);
    this.setAlreadyWatchedClickHandler(this._callback.alreadyWatchedClick);
    this.setFavoriteClickHandler(this._callback.favoriteClick);
  };

  setDeleteCommentClickHandler = (callback) => {
    this._callback.deleteCommentClick = callback;
    this.element.querySelectorAll('.film-details__comment-delete').forEach((element) => element.addEventListener('click', this.#deleteCommentClickHandler));
  };

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

  #deleteCommentClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.deleteCommentClick(evt.target.closest('.film-details__comment').id);
  };

  #closeDetailsClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.closeDetailsClick();
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
