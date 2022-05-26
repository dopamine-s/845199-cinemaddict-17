import { adaptCommentDate } from '../utils/utils.js';

export const createCommentTemplate = (commentItem) => {
  const {
    author,
    comment,
    commentDate,
    emotion,
  } = commentItem;

  const getAdaptedCommentDate = (date) => {
    if (date) {
      return adaptCommentDate(date);
    }

    return '';
  };

  return `<li class="film-details__comment">
            <span class="film-details__comment-emoji">
              <img src="./images/emoji/${emotion}.png" width="55" height="55" alt="emoji-${emotion}">
            </span>
            <div>
              <p class="film-details__comment-text">${comment}</p>
              <p class="film-details__comment-info">
                <span class="film-details__comment-author">${author}</span>
                <span class="film-details__comment-day">${getAdaptedCommentDate(commentDate)}</span>
                <button class="film-details__comment-delete">Delete</button>
              </p>
            </div>
          </li>`;
};
