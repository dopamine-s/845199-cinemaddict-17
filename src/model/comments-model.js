import Observable from '../framework/observable.js';
import { generateMockComments } from '../mock/mock-movie-data.js';

export const MAX_COMMENTS = 20;

export default class CommentsModel extends Observable {
  #comments = generateMockComments(MAX_COMMENTS);

  get comments() {
    return this.#comments;
  }

  getComment(commentId) {
    return this.#comments.find((singleComment) => singleComment.id === commentId);
  }

  addComment = (updateType, update) => {
    this.#comments = [
      update,
      ...this.#comments,
    ];

    this._notify(updateType, update);
  };

  deleteComment = (updateType, update) => {
    const index = this.#comments.findIndex((comment) => comment.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting comment');
    }

    this.#comments = [
      ...this.#comments.slice(0, index),
      ...this.#comments.slice(index + 1),
    ];

    this._notify(updateType);
  };
}
