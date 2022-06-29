import { SORT_TYPE } from '../consts.js';

export const createSortTemplate = (currentSortType) =>
  `<ul class="sort">
    <li><a href="#" class="sort__button${currentSortType === SORT_TYPE.DEFAULT ? ' sort__button--active' : ''}" data-sort-type="${SORT_TYPE.DEFAULT}">Sort by default</a></li>
    <li><a href="#" class="sort__button${currentSortType === SORT_TYPE.DATE ? ' sort__button--active' : ''}" data-sort-type="${SORT_TYPE.DATE}">Sort by date</a></li>
    <li><a href="#" class="sort__button${currentSortType === SORT_TYPE.RATING ? ' sort__button--active' : ''}" data-sort-type="${SORT_TYPE.RATING}">Sort by rating</a></li>
  </ul>`;
