import Observable from '../framework/observable.js';
import { generateMockMovieData, generateMockComments } from '../mock/mock-movie-data.js';

const MOCK_MOVIES_AMMOUNT =30;
export const MAX_COMMENTS = 20;

export default class MoviesModel extends Observable {
  #movies = Array.from({ length: MOCK_MOVIES_AMMOUNT }, generateMockMovieData);
  #comments = generateMockComments(MAX_COMMENTS);

  get movies() {
    return this.#movies;
  }

  get comments() {
    return this.#comments;
  }

  updateMovie = (updateType, update) => {
    const index = this.#movies.findIndex((movie) => movie.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting movie');
    }

    this.#movies = [
      ...this.#movies.slice(0, index),
      update,
      ...this.#movies.slice(index + 1),
    ];

    this._notify(updateType, update);
  };

  addComment = (updateType, update) => {
    this.#comments = [
      update,
      ...this.comments,
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


