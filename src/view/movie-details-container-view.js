import AbstractView from '../framework/view/abstract-view.js';
import { createMovieDetailsContainerTemplate } from '../templates/movie-details-container-template.js';

export default class MovieDetailsContainerView extends AbstractView {
  get template() {
    return createMovieDetailsContainerTemplate();
  }
}


