import { adaptCommentDate } from '../utils/utils.js';
import he from 'he';

export const commentTemplate = (comment, state) => {
  const getAdaptedCommentDate = (date) => {
    if (date) {
      return adaptCommentDate(date);
    }

    return '';
  };
  const isDisabled = state.isDisabled ? 'disabled' : '';
  const isDeleting = state.isDeleting ? 'deleting...' : 'Delete';

  return `<li class="film-details__comment">
            <span class="film-details__comment-emoji">
              <img src="./images/emoji/${comment.emotion}.png" width="55" height="55" alt="emoji-${comment.emotion}">
            </span>
            <div>
              <p class="film-details__comment-text">${he.encode(comment.comment)}</p>
              <p class="film-details__comment-info">
                <span class="film-details__comment-author">${comment.author}</span>
                <span class="film-details__comment-day">${getAdaptedCommentDate(comment.date)}</span>
                <button class="film-details__comment-delete"${isDisabled}>${isDeleting}</button>
              </p>
            </div>
          </li>`;
};
