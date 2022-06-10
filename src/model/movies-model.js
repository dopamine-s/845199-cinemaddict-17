import Observable from '../framework/observable.js';
import { UPDATE_TYPE } from '../consts.js';
// import { generateMockMovieData } from '../mock/mock-movie-data.js';

// const MOCK_MOVIES_AMMOUNT = 30;

export default class MoviesModel extends Observable {
  #api = null;
  // #movies = Array.from({ length: MOCK_MOVIES_AMMOUNT }, generateMockMovieData);
  #movies = [];

  constructor(api) {
    super();
    this.#api = api;

    this.#api.movies.then((movies) => {
      console.log('Список фильмов, приходящий с сервера', movies);
      console.log('Адаптированный для клиента список фильмов с сервера', movies.map(this.#adaptMovieToClient));
    });
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

  init = async () => {
    try {
      const movies = await this.#api.movies;
      this.#movies = movies.map(this.#adaptMovieToClient);
    } catch(err) {
      this.#movies = [];
    }

    this._notify(UPDATE_TYPE.INIT);
  };

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

  addMovie = (updateType, update) => {
    this.#movies = [
      update,
      ...this.#movies,
    ];

    this._notify(updateType, update);
  };

  deleteMovie = (updateType, update) => {
    const index = this.#movies.findIndex((movie) => movie.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting movie');
    }

    this.#movies = [
      ...this.#movies.slice(0, index),
      ...this.#movies.slice(index + 1),
    ];

    this._notify(updateType);
  };
}
