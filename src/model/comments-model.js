import Observable from '../framework/observable.js';
// import { generateMockComments } from '../mock/mock-movie-data.js';

// export const MAX_COMMENTS = 20;

export default class CommentsModel extends Observable {
  #api = null;
  #comments = [];
  // #comments = generateMockComments(MAX_COMMENTS);

  constructor(api) {
    super();
    this.#api = api;
  }

  getCommentsByMovieId = async (movieId) => {
    try {
      const comments = await this.#api.getComments(movieId);
      this.#comments = comments;
    } catch(err) {
      this.#comments = [];
      throw new Error('Can\'t get comments by movie ID');
    }
    return this.#comments;
  };

  get comments() {
    return this.#comments;
  }

  getComment(commentId) {
    return this.#comments.find((singleComment) => singleComment.id === commentId);
  }

  addComment = async (movieId, update) => {
    try {
      const updatedData = await this.#api.addComment(movieId, update);
      this.#comments = updatedData.comments;
      return updatedData.movie;
    } catch (err) {
      throw new Error('Can\'t add comment');
    }
  };

  deleteComment = async (updateType, update) => {
    const index = this.#comments.findIndex((comment) => comment.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting comment');
    }

    try {
      await this.#api.deleteComment(update);
      this.#comments = [
        ...this.#comments.slice(0, index),
        ...this.#comments.slice(index + 1),
      ];
    } catch (err) {
      throw new Error('Can\'t detele comment');
    }
  };
}
