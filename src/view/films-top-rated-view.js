import AbstractView from '../framework/view/abstract-view.js';
import { createFilmsTopRatedTemplate } from '../templates/films-top-rated-template.js';

export default class FilmsTopRatedView extends AbstractView{
  get template() {
    return createFilmsTopRatedTemplate();
  }
}
