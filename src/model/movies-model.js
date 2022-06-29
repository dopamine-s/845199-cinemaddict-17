import Observable from '../framework/observable.js';
import { UPDATE_TYPE, TOP_RATED_MOVIES_AMOUNT, MOST_COMMENTED_MOVIES_AMOUNT } from '../consts.js';
import { adaptMovieToClient } from '../services/api-adapter.js';

export default class MoviesModel extends Observable {
  #api = null;
  #movies = [];
  #topRatedMovies = null;
  #mostCommentedMovies = null;

  constructor(api) {
    super();
    this.#api = api;
  }

  get movies() {
    return this.#movies;
  }

  get topRatedMovies() {
    if (!this.#topRatedMovies) {
      this.#topRatedMovies = [...this.movies]
        .sort((a, b) => b.filmInfo.totalRating - a.filmInfo.totalRating)
        .slice(0, Math.min(this.movies.length, TOP_RATED_MOVIES_AMOUNT));
    }

    return this.#topRatedMovies;
  }

  get mostCommentedMovies() {
    if (!this.#mostCommentedMovies) {
      this.#mostCommentedMovies = [...this.movies]
        .sort((a, b) => b.comments.length - a.comments.length)
        .slice(0, Math.min(this.movies.length, MOST_COMMENTED_MOVIES_AMOUNT));
    }

    return this.#mostCommentedMovies;
  }

  init = async () => {
    try {
      const movies = await this.#api.movies;
      this.#movies = movies.map(adaptMovieToClient);
    } catch (err) {
      this.#movies = [];
    }

    this._notify(UPDATE_TYPE.INIT);
  };

  updateMovie = async (updateType, update) => {
    const index = this.#findIfMovieExist(update);
    const response = await this.#api.updateMovie(update);
    const updatedMovie = adaptMovieToClient(response);
    this.#setLocalMovie(index, updateType, updatedMovie);
  };

  updateLocalMovie = async (updateType, update) => {
    const index = this.#findIfMovieExist(update);
    this.#setLocalMovie(index, updateType, update);
  };

  #findIfMovieExist = (update) => {
    const index = this.#movies.findIndex((movie) => movie.id === update.id);
    if (index === -1) {
      throw new Error('Can\'t update non-existing movie');
    }
    return index;
  };

  #setLocalMovie = (index, updateType, update) => {
    if (update.user_details) {
      update = adaptMovieToClient(update);
    }

    this.#movies = [
      ...this.#movies.slice(0, index),
      update,
      ...this.#movies.slice(index + 1),
    ];

    this.#mostCommentedMovies = null;
    this.#topRatedMovies = null;

    this._notify(updateType, update);
  };
}
