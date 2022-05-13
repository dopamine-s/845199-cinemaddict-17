import AbstractView from '../framework/view/abstract-view.js';
import { createNoMoviesTemplate } from '../templates/no-movies-template.js';

export default class NoMoviesView extends AbstractView {
  get template() {
    return createNoMoviesTemplate();
  }
}
