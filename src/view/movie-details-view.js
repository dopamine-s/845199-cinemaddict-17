import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { createMovieDetailsTemplate } from '../templates/movie-details-template.js';

export default class MovieDetailsView extends AbstractStatefulView {
  #renderComments = null;

  constructor(movie, renderComments) {
    super();
    this._state = MovieDetailsView.convertMovieToState(movie);
    this.#setInnerHandlers();
    this.#renderComments = renderComments;
  }

  get template() {
    return createMovieDetailsTemplate(this._state);
  }

  reset = (movie) => {
    this.updateElement(
      MovieDetailsView.convertMovieToState(movie),
    );
  };

  static convertMovieToState = (movie) => ({
    ...movie,
    checkedEmoji: null,
    commentText: null,
    scrollTop: null
  });

  static convertStateToMovie = (state) => {
    const movie = { ...state };

    delete movie.checkedEmoji;
    delete movie.commentText;
    delete movie.scrollTop;

    return movie;
  };

  #restorePosition = () => {
    this.element.scrollTop = this._state.scrollTop;
  };

  _restoreHandlers = () => {
    this.#setInnerHandlers();
    this.#setOuterHandlers();
  };

  #setInnerHandlers = () => {
    this.setEmojiChangeHandler(this._callback.emojiChange);
    this.setCommentInputHandler(this._callback.textInput);
  };

  #setOuterHandlers = () => {
    this.setCloseDetailsClickHandler(this._callback.closeDetailsClick);
    this.setWatchlistClickHandler(this._callback.watchlistClick);
    this.setAlreadyWatchedClickHandler(this._callback.alreadyWatchedClick);
    this.setFavoriteClickHandler(this._callback.favoriteClick);
  };

  setEmojiChangeHandler = (callback) => {
    this._callback.emojiChange = callback;
    this.element.querySelectorAll('.film-details__emoji-item').forEach((emoji) => {
      emoji.addEventListener('change', this.#emojiChangeHandler);
    });
  };

  setCommentInputHandler = (callback) => {
    this._callback.textInput = callback;
    this.element.querySelector('.film-details__comment-input').addEventListener('input', this.#commentInputHandler);
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

  #emojiChangeHandler = (evt) => {
    evt.preventDefault();
    const emojiInputItem = evt.target.closest('.film-details__emoji-item');
    if (emojiInputItem) {
      this.updateElement({
        checkedEmoji: emojiInputItem.value,
        scrollTop: this.element.scrollTop
      });
    }
    this.#renderComments();
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
