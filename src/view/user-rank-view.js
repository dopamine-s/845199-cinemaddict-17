import AbstractView from '../framework/view/abstract-view.js';
import { createUserRankTemplate } from '../templates/user-rank-template.js';

export default class UserRankView extends AbstractView {
  get template() {
    return createUserRankTemplate();
  }
}
