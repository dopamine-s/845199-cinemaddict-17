import { remove, render } from '../framework/render.js';
import CommentView from '../view/comment-view';
import { UPDATE_TYPE, USER_ACTION } from '../consts.js';

export default class CommentPresenter {
  #commentsContainer = null;
  #commentComponent = null;
  #movie = null;
  #comment = null;
  #changeMovie = null;
  #commentsModel = null;

  constructor(commentsContainer, changeMovie, commentsModel) {
    this.#commentsContainer = commentsContainer;
    this.#changeMovie = changeMovie;
    this.#commentsModel = commentsModel;
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

  #handleDeleteClick = async () => {
    const update = this.#comment;
    try {
      await this.#commentsModel.deleteComment(
        UPDATE_TYPE.PATCH,
        update
      );

      this.#movie.comments = this.#movie.comments.filter((comment) => comment.id !== this.#comment.id);

      this.#changeMovie(
        USER_ACTION.DELETE,
        UPDATE_TYPE.PATCH,
        {
          ...this.#movie,
          isDelete: true,
          setViewAction: this.#setDeleting,
          setAborting: this.#setAborting,
        }
      );
    } catch (err) {
      this.#setAborting();
    }
  };

  #setDeleting = () => {
    this.#commentComponent.updateElement({
      isDisabled: true,
      isDeleting: true
    });
  };

  #setAborting = () => {
    const resetState = () => {
      this.#commentComponent.updateElement({
        isDisabled: false,
        isDeleting: false,
      });
    };

    this.#commentComponent.shake(resetState);
    this.#commentComponent.setDeleteClickHandler(this.#handleDeleteClick);
  };
}
