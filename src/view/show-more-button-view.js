import AbstractView from '../framework/view/abstract-view.js';
import { createShowMoreButtonTemplate } from '../templates/show-more-button-template.js';

export default class ShowMoreButtonView extends AbstractView{
  get template() {
    return createShowMoreButtonTemplate();
  }
}
