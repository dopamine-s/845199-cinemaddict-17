import { humanizeDayDate, getTimeFromMins } from '../utils/utils.js';
import { EMOJIS } from '../consts';
import CommentView from '../view/comment-view.js';

export const createMovieDetailsTemplate = (state, movieComments) => {
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
    },
    checkedEmoji,
    commentText,
    isDisabled,
    isDeletingComment,
    isAddingComment

  } = state;

  const commentsTemplate = movieComments.map((comment) => new CommentView(comment, isDeletingComment).template).join('');

  const getEmojisHtml = () => {
    const EmojisHtml = [];
    EMOJIS.forEach((item) => {
      EmojisHtml.push(
        `<input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-${item}" value="${item}" ${isDisabled ? 'disabled' : ''} ${checkedEmoji === item ? 'checked' : ''}>
          <label class="film-details__emoji-label" for="emoji-${item}">
            <img src="./images/emoji/${item}.png" width="30" height="30" alt="emoji">
          </label>`
      );
    });
    return EmojisHtml;
  };

  const isWatchlistActive = watchlist ? 'film-details__control-button--active' : '';
  const isAlreadyWatchedActive = alreadyWatched ? 'film-details__control-button--active' : '';
  const isFavoriteActive = favorite ? 'film-details__control-button--active' : '';

  const getHumanizeDayDate = (dayDate) => {
    if (dayDate) {
      return humanizeDayDate(dayDate);
    }
    return '';
  };

  const getTimeInHoursAndMins = (timeInMinutes) => getTimeFromMins(timeInMinutes);

  return (
    `<section class="film-details">
    <form class="film-details__inner" action="" method="get">
      <div class="film-details__top-container">
        <div class="film-details__close">
          <button class="film-details__close-btn" type="button">close</button>
        </div>
        <div class="film-details__info-wrap">
          <div class="film-details__poster">
            <img class="film-details__poster-img" src="${poster}" alt="${title}">
            <p class="film-details__age">${ageRating ? `${ageRating}+` : ''}</p>
          </div>

          <div class="film-details__info">
            <div class="film-details__info-head">
              <div class="film-details__title-wrap">
                <h3 class="film-details__title">${title}</h3>
                <p class="film-details__title-original">${alternativeTitle || ''}</p>
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
                <td class="film-details__cell">${getHumanizeDayDate(date)}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Runtime</td>
                <td class="film-details__cell">${getTimeInHoursAndMins(runtime)}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Country</td>
                <td class="film-details__cell">${releaseCountry}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Genres</td>
                <td class="film-details__cell">
                  ${genre.map((genreItem) => `<span class="film-details__genre">${genreItem}</span>`).join('')}
                </td>
              </tr>
            </table>

            <p class="film-details__film-description">${description}</p>
          </div>
        </div>

        <section class="film-details__controls">
          <button type="button" class="film-details__control-button film-details__control-button--watchlist ${isWatchlistActive}" id="watchlist" name="watchlist"${isDisabled ? ' disabled' : ''}>Add to watchlist</button>
          <button type="button" class="film-details__control-button film-details__control-button--watched ${isAlreadyWatchedActive}" id="watched" name="watched"${isDisabled ? ' disabled' : ''}>Already watched</button>
          <button type="button" class="film-details__control-button film-details__control-button--favorite ${isFavoriteActive}" id="favorite" name="favorite"${isDisabled ? ' disabled' : ''}>Add to favorites</button>
        </section>
      </div>

      <div class="film-details__bottom-container">
        <section class="film-details__comments-wrap">
          <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${comments.length}</span></h3>

          <ul class="film-details__comments-list">
          ${commentsTemplate}
          </ul>

          <div class="film-details__new-comment">
            <div class="film-details__add-emoji-label">${checkedEmoji ? `<img src="./images/emoji/${checkedEmoji}.png" width="70" height="70" alt="${checkedEmoji}">` : ''}</div>

            <label class="film-details__comment-label">
              <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment" ${isAddingComment ? 'disabled' : ''}>${commentText ? commentText : ''}</textarea>
            </label>

            <div class="film-details__emoji-list">
              ${getEmojisHtml().join('')}
            </div>
          </div>
        </section>
      </div>
    </form>
  </section>`
  );
};
