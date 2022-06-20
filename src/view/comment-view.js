import { commentTemplate } from '../templates/comment-template.js';
import AbstractView from '../framework/view/abstract-stateful-view.js';

export default class CommentView extends AbstractView {
  #comment = {};
  #isDeletingComment = null;

  constructor(comment, isDeletingComment) {
    super();
    this.#comment = comment;
    this.#isDeletingComment = isDeletingComment;
  }

  get template() {
    return commentTemplate(this.#comment, this.#isDeletingComment);
  }
}
