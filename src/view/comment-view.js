import { commentTemplate } from '../templates/comment-template.js';
import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';

export default class CommentView extends AbstractStatefulView {
  #comment = null;
  constructor(comment) {
    super();
    this.#comment = comment;
  }

  get template() {
    return commentTemplate(this.#comment);
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
