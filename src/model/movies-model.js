import Observable from '../framework/observable.js';
import { UPDATE_TYPE } from '../consts.js';
import { adaptMovieToClient } from '../services/api-adapter.js';

export default class MoviesModel extends Observable {
  #api = null;
  #movies = [];

  constructor(api) {
    super();
    this.#api = api;
  }

  get movies() {
    return this.#movies;
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

  updateMovie = async (updateType, updatedMovie) => {
    const index = this.#movies.findIndex((movie) => movie.id === updatedMovie.id);
    let modifiedMovie = updatedMovie;

    if (index === -1) {
      throw new Error('Can\'t update unexisting movie');
    }

    try {
      if (updateType === UPDATE_TYPE.PATCH) {
        const response = await this.#api.updateMovie(updatedMovie);
        modifiedMovie = adaptMovieToClient(response);
      }

      this.#movies = [
        ...this.#movies.slice(0, index),
        modifiedMovie,
        ...this.#movies.slice(index + 1),
      ];

      this._notify(updateType, modifiedMovie);
    } catch (err) {
      throw new Error ('Can\'t update movie');
    }
  };
}
