import Observable from '../framework/observable.js';

export default class CommentsModel extends Observable {
  #api = null;
  #comments = [];

  constructor(api) {
    super();
    this.#api = api;
  }

  getCommentsByMovieId = async (movieId) => {
    try {
      const comments = await this.#api.getComments(movieId);
      this.#comments = comments;
    } catch (err) {
      this.#comments = [];
      throw new Error('Can\'t get comments by movie ID');
    }
    return this.#comments;
  };

  get comments() {
    return this.#comments;
  }

  set comments(comments) {
    this.#comments = comments;
  }

  addComment = async (movieId, update) => {
    const updatedData = await this.#api.addComment(movieId, update);
    this.#comments = updatedData.comments;
    return updatedData.movie;
  };

  deleteComment = async (updateType, id) => {
    await this.#api.deleteComment(id);
    this.#comments = this.#comments.filter((comment) => comment.id !== id);
  };
}
