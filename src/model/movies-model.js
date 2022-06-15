import Observable from '../framework/observable.js';
import { UPDATE_TYPE } from '../consts.js';

const TOP_RATED_MOVIES_AMOUNT = 2;
const MOST_COMMENTED_MOVIES_AMOUNT = 2;

export default class MoviesModel extends Observable {
  #api = null;
  #movies = [];
  #topRatedMovies = null;
  #mostCommentedMovies = null;

  constructor(api) {
    super();
    this.#api = api;
  }

  #adaptMovieToClient = (movie) => {
    const adaptedMovie = {
      id: movie.id,
      comments: movie.comments,
      filmInfo: {
        ...movie.film_info,
        ageRating: movie.film_info.age_rating,
        alternativeTitle: movie.film_info.alternative_title,
        totalRating: movie.film_info.total_rating,
        release: {
          date: movie.film_info.release.date !== null ? new Date(movie.film_info.release.date) : movie.film_info.release.date,
          releaseCountry: movie.film_info.release.release_country
        }
      },
      userDetails: {
        ...movie.user_details,
        alreadyWatched: movie.user_details.already_watched,
        watchingDate: movie.user_details.watching_date !== null ? new Date(movie.user_details.watching_date) : movie.user_details.watching_date
      }
    };

    delete adaptedMovie.filmInfo.alternative_title;
    delete adaptedMovie.filmInfo.total_rating;
    delete adaptedMovie.filmInfo.age_rating;
    delete adaptedMovie.userDetails.already_watched;
    delete adaptedMovie.userDetails.watching_date;

    return adaptedMovie;
  };

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
      this.#movies = movies.map(this.#adaptMovieToClient);
    } catch(err) {
      this.#movies = [];
    }

    this._notify(UPDATE_TYPE.INIT);
  };

  updateMovie = async (updateType, update) => {
    const index = this.#movies.findIndex((movie) => movie.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting movie');
    }

    try {
      const response = await this.#api.updateMovie(update);
      const updatedMovie = this.#adaptMovieToClient(response);

      this.#movies = [
        ...this.#movies.slice(0, index),
        updatedMovie,
        ...this.#movies.slice(index + 1),
      ];

      this._notify(updateType, updatedMovie);
    } catch (err) {
      throw new Error ('Can\'t update movie');
    }
  };
}
