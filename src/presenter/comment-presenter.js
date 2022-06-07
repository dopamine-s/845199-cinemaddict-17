import { remove, render } from '../framework/render.js';
import CommentView from '../view/comment-view';
import { UPDATE_TYPE, USER_ACTION } from '../consts.js';

export default class CommentPresenter {
  #commentsContainer = null;
  #commentComponent = null;
  #movie = null;
  #comment = null;
  #changeMovie = null;

  constructor(commentsContainer, changeMovie) {
    this.#commentsContainer = commentsContainer;
    this.#changeMovie = changeMovie;
  }

  init(comment, movie) {
    this.#movie = movie;
    this.#comment = comment;
    this.#commentComponent = new CommentView(comment);
    this.#commentComponent.setDeleteClickHandler(this.#handleDeleteClick);
    render(this.#commentComponent, this.#commentsContainer);
  }

  destroy = () => {
    remove(this.#commentComponent);
  };

  #handleDeleteClick = () => {
    const currentCommentIndex = this.#movie.comments.findIndex(
      (commentId) => commentId === this.#comment.id
    );
    if (currentCommentIndex !== -1) {
      this.#movie.comments.splice(currentCommentIndex, 1);
    }
    this.#changeMovie(USER_ACTION.UPDATE, UPDATE_TYPE.PATCH, this.#movie);
  };
}
