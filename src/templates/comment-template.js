import { adaptCommentDate } from '../utils/utils.js';

export const commentTemplate = (comment) => {
  const getAdaptedCommentDate = (date) => {
    if (date) {
      return adaptCommentDate(date);
    }

    return '';
  };

  return `<li class="film-details__comment">
            <span class="film-details__comment-emoji">
              <img src="./images/emoji/${comment.emotion}.png" width="55" height="55" alt="emoji-${comment.emotion}">
            </span>
            <div>
              <p class="film-details__comment-text">${comment.comment}</p>
              <p class="film-details__comment-info">
                <span class="film-details__comment-author">${comment.author}</span>
                <span class="film-details__comment-day">${getAdaptedCommentDate(comment.commentDate)}</span>
                <button class="film-details__comment-delete">Delete</button>
              </p>
            </div>
          </li>`;
};
