import AbstractView from '../framework/view/abstract-view.js';
import { createUserRankTemplate } from '../templates/user-rank-template.js';

export default class UserRankView extends AbstractView {
  #userRank = null;

  constructor(userRank) {
    super();
    this.#userRank = userRank;
  }

  get template() {
    return createUserRankTemplate(this.#userRank);
  }
}
