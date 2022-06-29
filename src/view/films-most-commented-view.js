import AbstractView from '../framework/view/abstract-view.js';
import { createFilmsMostCommentedTemplate } from '../templates/films-most-commented-template.js';

export default class FilmsMostCommentedView extends AbstractView {
  get template() {
    return createFilmsMostCommentedTemplate();
  }
}
