import AbstractView from '../framework/view/abstract-view.js';
import { createFilmsContainerTemplate } from '../templates/films-container-template.js';

export default class FilmsContainerView extends AbstractView{
  get template() {
    return createFilmsContainerTemplate();
  }
}
