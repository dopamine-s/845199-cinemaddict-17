import AbstractView from '../framework/view/abstract-view.js';
import { createMovieCardTemplate } from '../templates/movie-card-template.js';

export default class MovieCardView extends AbstractView{
  #movie = null;

  constructor(movie) {
    super();
    this.#movie = movie;
  }

  get template() {
    return createMovieCardTemplate(this.#movie);
  }
}
