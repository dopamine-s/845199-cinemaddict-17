import { commentTemplate } from '../templates/comment-template.js';
import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';

export default class CommentView extends AbstractStatefulView {
  #comment = null;
  _state;
  #callback;

  constructor(comment, callback) {
    super();
    this.#comment = comment;
    this.#callback = callback;
    this._state = {
      isDisabled: false,
      isDeleting: false
    };
  }

  _restoreHandlers = () => {
    this.setDeleteClickHandler(this.#callback);
  };

  get template() {
    return commentTemplate(this.#comment, this._state);
  }

  setDeleteClickHandler = (callback) => {
    this._callback.deleteClick = callback;
    this.element.querySelector('.film-details__comment-delete')
      .addEventListener('click', this.#commentDeleteClickHandler);
  };

  #commentDeleteClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.deleteClick();
  };
}
