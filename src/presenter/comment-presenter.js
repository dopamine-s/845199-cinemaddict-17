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
        USER_ACTION.UPDATE,
        UPDATE_TYPE.PATCH,
        {
          ...this.#movie
        }
      );
      // const currentCommentIndex = this.#movie.comments.findIndex(
      //   (commentId) => commentId === this.#comment.id
      // );

      // if (currentCommentIndex !== -1) {
      //   this.#movie.comments.splice(currentCommentIndex, 1);
      // }

      // this.#changeMovie(
      //   USER_ACTION.UPDATE,
      //   UPDATE_TYPE.PATCH,
      //   this.#movie);
    } catch (err) {
      throw new Error('Can\'t delete comment');
    }
  };
}
