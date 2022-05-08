import { createElement } from '../render.js';

const createMoviesAmountTemplate = (moviesAmount) =>
  `<section class="footer__statistics">
    <p>${moviesAmount} movies inside</p>
  </section>`;

export default class MoviesAmountView {
  constructor(movies) {
    this.moviesAmount = movies.length;
  }

  getTemplate() {
    return createMoviesAmountTemplate(this.moviesAmount);
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate(this.moviesAmount));
    }

    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
