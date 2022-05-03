import { createElement } from '../render.js';
import { humanizeYearDate, getTimeFromMins } from '../utils.js';

const createMovieCardTemplate = (movie) => {

  const MAX_DESCRIPTION_LENGTH = 140;
  const { comments, filmInfo: { title, totalRating, description, poster, release: { date }, runtime, genre } } = movie;
  //console.log ()
  const getHumanizeYearDate = () => {
    if (date && date !== null) {
      return humanizeYearDate(date);
    } else {
      return '';
    }
  };

  const getRuntime = () => getTimeFromMins(runtime);

  const takeDescription = () => {
    if (description && description.length > MAX_DESCRIPTION_LENGTH) {
      return `${description.substring(0, MAX_DESCRIPTION_LENGTH - 1)}...`;
    }
  };

  const takeMainGenre = () => {
    const mainGenre = genre[0];
    if (mainGenre) {
      return mainGenre;
    } else {
      return '';
    }
  };

  return (
    `<article class="film-card">
    <a class="film-card__link">
      <h3 class="film-card__title">${title}</h3>
      <p class="film-card__rating">${totalRating}</p>
      <p class="film-card__info">
        <span class="film-card__year">${getHumanizeYearDate()}</span>
        <span class="film-card__duration">${getRuntime()}</span>
        <span class="film-card__genre">${takeMainGenre()}</span>
      </p>
      <img src="${poster}" alt="" class="film-card__poster">
      <p class="film-card__description">${takeDescription()}</p>
      <span class="film-card__comments">${comments.length} comments</span>
    </a>
    <div class="film-card__controls">
      <button class="film-card__controls-item film-card__controls-item--add-to-watchlist" type="button">Add to watchlist</button>
      <button class="film-card__controls-item film-card__controls-item--mark-as-watched" type="button">Mark as watched</button>
      <button class="film-card__controls-item film-card__controls-item--favorite" type="button">Mark as favorite</button>
    </div>
  </article>`
  );
};

export default class MovieCardView {
  constructor(movie) {
    this.movie = movie;
  }

  getTemplate() {
    return createMovieCardTemplate(this.movie);
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
