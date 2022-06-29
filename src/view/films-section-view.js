import AbstractView from '../framework/view/abstract-view.js';
import { createFilmsSectionTemplate } from '../templates/films-section-template.js';

export default class FilmsSectionView extends AbstractView {
  get template() {
    return createFilmsSectionTemplate();
  }
}
