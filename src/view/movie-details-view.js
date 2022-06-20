import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { createMovieDetailsTemplate } from '../templates/movie-details-template.js';

export default class MovieDetailsView extends AbstractStatefulView {
  #movieComments = [];

  constructor(movie, comments) {
    super();
    this.#movieComments = comments;
    this._state = this.#convertMovieToState(movie);
    this.#setInnerHandlers();
  }

  get template() {
    return createMovieDetailsTemplate(this._state, this.#movieComments);
  }

  reset = (movie) => {
    this.updateElement(
      this.#convertMovieToState(movie),
    );
  };

  #convertMovieToState = (movie) => ({
    ...movie,
    checkedEmoji: null,
    commentText: null,
    scrollTop: null,
    isDeletingComment: false,
    isAddingComment: false,
    isDisabled: false,
  });

  restorePosition = () => {
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
    this.setAddCommentHandler(this._callback.addComment);
    this.setDeleteCommentHandler(this._callback.deleteComment);
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

  setAddCommentHandler = (callback) => {
    this._callback.addComment = callback;
    this.element.querySelector('.film-details__comment-input').addEventListener('keydown', this.#addCommentHandler);
  };

  setDeleteCommentHandler = (callback) => {
    this._callback.deleteComment = callback;
    this.element.querySelectorAll('.film-details__comment-delete').forEach((element) => element.addEventListener('click', this.#deleteCommentHandler));
  };

  #emojiChangeHandler = (evt) => {
    evt.preventDefault();
    const emojiInputItem = evt.target.closest('.film-details__emoji-item');
    this.updateElement({
      checkedEmoji: emojiInputItem.value,
      scrollTop: this.element.scrollTop
    });

    this.restorePosition();
  };

  #commentInputHandler = (evt) => {
    evt.preventDefault();
    this._setState({
      commentText: evt.target.value,
      scrollTop: this.element.scrollTop
    });
    this.restorePosition();
  };

  #closeDetailsClickHandler = (evt) => {
    evt.preventDefault();
    document.body.classList.remove('hide-overflow');
    this._callback.closeDetailsClick();
  };

  #watchlistClickHandler = (evt) => {
    evt.preventDefault();
    this.updateElement({
      scrollTop: this.element.scrollTop,
      isDisabled: true,
    });
    this._callback.watchlistClick();
  };

  #alreadyWatchedClickHandler = (evt) => {
    evt.preventDefault();
    this.updateElement({
      scrollTop: this.element.scrollTop,
      isDisabled: true,
    });
    this._callback.alreadyWatchedClick();
  };

  #favoriteClickHandler = (evt) => {
    evt.preventDefault();
    this.updateElement({
      scrollTop: this.element.scrollTop,
      isDisabled: true,
    });
    this._callback.favoriteClick();
  };

  #addCommentHandler = (evt) => {
    if ((evt.ctrlKey || evt.metaKey) && evt.keyCode === 13 && this._state.checkedEmoji) {
      this.updateElement({
        scrollTop: this.element.scrollTop,
        isAddingComment: true,
      });
      this._callback.addComment({
        comment: this._state.commentText ? this._state.commentText : '',
        emotion: this._state.checkedEmoji,
      });
    }
  };

  #deleteCommentHandler = (evt) => {
    evt.preventDefault();
    const commentId = evt.target.closest('.film-details__comment').id;
    this.updateElement({
      scrollTop: this.element.scrollTop,
      isDeletingComment: true,
    });
    this.element.querySelector(`.film-details__comment[id="${commentId}"]`).querySelector('.film-details__comment-delete').textContent = 'Deleting...';
    this._callback.deleteComment(evt.target.closest('.film-details__comment').id);
  };
}
