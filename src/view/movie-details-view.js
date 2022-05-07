import { createElement } from '../render.js';
import { humanizeDayDate, adaptCommentDate, getTimeFromMins } from '../utils.js';

const createCommentTemplate = (commentItem) => {
  const {
    author,
    comment,
    date,
    emotion,
  } = commentItem;

  const getAdaptedCommentDate = () => {
    if (date && date !== null) {
      return adaptCommentDate(date);
    } else {
      return '';
    }
  };

  return `<li class="film-details__comment">
  <span class="film-details__comment-emoji">
    <img src="./images/emoji/${emotion}.png" width="55" height="55" alt="emoji-sleeping">
  </span>
  <div>
    <p class="film-details__comment-text">${comment}</p>
    <p class="film-details__comment-info">
      <span class="film-details__comment-author">${author}</span>
      <span class="film-details__comment-day">${getAdaptedCommentDate()}</span>
      <button class="film-details__comment-delete">Delete</button>
    </p>
  </div>
  </li>`;
};

const createAllComments = (movieComments) => {
  let comments = '';
  for (const comment of movieComments) {
    comments = comments + createCommentTemplate(comment);
    return comments;
  }
};

const createMovieDetailsTemplate = (movie) => {
  const allComments = [];

  const {
    comments,
    filmInfo: {
      title,
      alternativeTitle,
      totalRating,
      poster,
      ageRating,
      director,
      writers,
      actors,
      release: {
        date,
        releaseCountry
      },
      runtime,
      genre,
      description,
    },
    userDetails: {
      watchlist,
      alreadyWatched,
      favorite,
    }
  } = movie;

  const isWatchlistActive = watchlist ? 'film-details__control-button--active' : '';
  const isAlreadyWatchedActive = alreadyWatched ? 'film-details__control-button--active' : '';
  const isFavoriteActive = favorite ? 'film-details__control-button--active' : '';

  const getHumanizeDayDate = () => {
    if (date && date !== null) {
      return humanizeDayDate(date);
    } else {
      return '';
    }
  };

  const takeAlternativeTitle = () => {
    if (alternativeTitle) {
      return alternativeTitle;
    } else {
      return '';
    }
  };

  const getRuntime = () => getTimeFromMins(runtime);

  const takeAgeRating = () => {
    if (ageRating) {
      return ageRating;
    } else {
      return '';
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

  const takeSecondGenre = () => {
    const secondGenre = genre[1];
    if (secondGenre) {
      return secondGenre;
    } else {
      return '';
    }
  };

  const takeThirdGenre = () => {
    const thirdGenre = genre[2];
    if (thirdGenre) {
      return thirdGenre;
    } else {
      return '';
    }
  };

  return (
    `<section class="film-details">
    <form class="film-details__inner" action="" method="get">
      <div class="film-details__top-container">
        <div class="film-details__close">
          <button class="film-details__close-btn" type="button">close</button>
        </div>
        <div class="film-details__info-wrap">
          <div class="film-details__poster">
            <img class="film-details__poster-img" src="${poster}" alt="">

            <p class="film-details__age">${takeAgeRating()}+</p>
          </div>

          <div class="film-details__info">
            <div class="film-details__info-head">
              <div class="film-details__title-wrap">
                <h3 class="film-details__title">${title}</h3>
                <p class="film-details__title-original">${takeAlternativeTitle()}</p>
              </div>

              <div class="film-details__rating">
                <p class="film-details__total-rating">${totalRating}</p>
              </div>
            </div>

            <table class="film-details__table">
              <tr class="film-details__row">
                <td class="film-details__term">Director</td>
                <td class="film-details__cell">${director}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Writers</td>
                <td class="film-details__cell">${writers}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Actors</td>
                <td class="film-details__cell">${actors}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Release Date</td>
                <td class="film-details__cell">${getHumanizeDayDate()}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Runtime</td>
                <td class="film-details__cell">${getRuntime()}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Country</td>
                <td class="film-details__cell">${releaseCountry}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Genres</td>
                <td class="film-details__cell">
                  <span class="film-details__genre">${takeMainGenre()}</span>
                  <span class="film-details__genre">${takeSecondGenre()}</span>
                  <span class="film-details__genre">${takeThirdGenre()}</span></td>
              </tr>
            </table>

            <p class="film-details__film-description">${description}</p>
          </div>
        </div>

        <section class="film-details__controls">
          <button type="button" class="film-details__control-button film-details__control-button--watchlist ${isWatchlistActive}" id="watchlist" name="watchlist">Add to watchlist</button>
          <button type="button" class="film-details__control-button film-details__control-button--watched ${isAlreadyWatchedActive}" id="watched" name="watched">Already watched</button>
          <button type="button" class="film-details__control-button film-details__control-button--favorite ${isFavoriteActive}" id="favorite" name="favorite">Add to favorites</button>
        </section>
      </div>

      <div class="film-details__bottom-container">
        <section class="film-details__comments-wrap">
          <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${comments.length}</span></h3>

          <ul class="film-details__comments-list">
          ${createAllComments(allComments)}
          </ul>

          <div class="film-details__new-comment">
            <div class="film-details__add-emoji-label"></div>

            <label class="film-details__comment-label">
              <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
            </label>

            <div class="film-details__emoji-list">
              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="smile">
              <label class="film-details__emoji-label" for="emoji-smile">
                <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
              </label>

              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping">
              <label class="film-details__emoji-label" for="emoji-sleeping">
                <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
              </label>

              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-puke" value="puke">
              <label class="film-details__emoji-label" for="emoji-puke">
                <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
              </label>

              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="angry">
              <label class="film-details__emoji-label" for="emoji-angry">
                <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji">
              </label>
            </div>
          </div>
        </section>
      </div>
    </form>
  </section>`
  );
};

export default class MovieDetailsView {
  constructor(movie, commentItem) {
    this.movie = movie;
    this.commentItem = commentItem;
  }

  getTemplate() {
    return createMovieDetailsTemplate(this.movie);
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
