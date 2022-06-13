import AbstractView from '../framework/view/abstract-view.js';
import MoviesAmountView from '../view/movies-amount-view.js';
import { render, replace, remove } from '../framework/render.js';

export default class MoviesAmountPresenter extends AbstractView {
  #moviesAmountContainer = null;
  #moviesModel = null;
  #moviesAmountComponent = null;


  constructor(moviesAmountContainer, moviesModel) {
    super();
    this.#moviesAmountContainer = moviesAmountContainer;
    this.#moviesModel = moviesModel;
  }

  init() {
    const movies = this.#moviesModel.movies;
    const prevMoviesAmountComponent = this.#moviesAmountComponent;
    this.#moviesModel.addObserver(this.#handleModelEvent);

    this.#moviesAmountComponent = new MoviesAmountView(movies);

    if (prevMoviesAmountComponent === null) {
      render(this.#moviesAmountComponent, this.#moviesAmountContainer);
      return;
    }

    replace(this.#moviesAmountComponent, prevMoviesAmountComponent);
    remove(prevMoviesAmountComponent);
  }

  #handleModelEvent = () => {
    this.init();
  };
}
