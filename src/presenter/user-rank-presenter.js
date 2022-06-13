import AbstractView from '../framework/view/abstract-view.js';
import UserRankView from '../view/user-rank-view.js';
import { render, replace, remove } from '../framework/render.js';

const userRankNamesList = {
  '':[0, 0],
  novice: [1, 10],
  fan: [11, 20],
  'Movie Buff': [21, Infinity]
};

export default class UserRankPresenter extends AbstractView {
  #alreadyWatchedMoviesAmount = null;
  #userRankName = null;
  #moviesModel = null;
  #userRankComponent = null;
  #userRankContainer = null;

  constructor (userRankContainer, moviesModel) {
    super();
    this.#userRankContainer = userRankContainer;
    this.#moviesModel = moviesModel;
  }

  init() {
    this.#alreadyWatchedMoviesAmount = this.#getAlreadyWatchedMoviesAmount(this.#moviesModel.movies);
    this.#userRankName = this.#getUserRankName(this.#alreadyWatchedMoviesAmount);
    const prevUserRankComponent = this.#userRankComponent;
    this.#moviesModel.addObserver(this.#handleModelEvent);

    this.#userRankComponent = new UserRankView(this.#userRankName);

    if (prevUserRankComponent === null) {
      render(this.#userRankComponent, this.#userRankContainer);
      return;
    }

    replace(this.#userRankComponent, prevUserRankComponent);
    remove(prevUserRankComponent);
  }

  #getAlreadyWatchedMoviesAmount = (movies) => movies.filter((movie) => movie.userDetails.alreadyWatched).length;

  #getUserRankName = (length) => Object.entries(userRankNamesList)
    .filter(([, value]) => length >= value[0] && length <= value[1])
    .flat()[0];

  #handleModelEvent = () => {
    this.init();
  };
}
