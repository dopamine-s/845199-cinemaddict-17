import AbstractView from '../framework/view/abstract-view.js';
import { createFilmsListTemplate } from '../templates/films-list-template.js';

export default class FilmsListView extends AbstractView {
  get template() {
    return createFilmsListTemplate();
  }
}
