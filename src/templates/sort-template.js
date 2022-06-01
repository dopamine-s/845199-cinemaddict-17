import { SortType } from '../consts.js';

export const createSortTemplate = (currentSortType) =>
  `<ul class="sort">
    <li><a href="#" class="sort__button${currentSortType === SortType.DEFAULT ? ' sort__button--active' : ''}" data-sort-type="${SortType.DEFAULT}">Sort by default</a></li>
    <li><a href="#" class="sort__button${currentSortType === SortType.DATE ? ' sort__button--active' : ''}" data-sort-type="${SortType.DATE}">Sort by date</a></li>
    <li><a href="#" class="sort__button${currentSortType === SortType.RATING ? ' sort__button--active' : ''}" data-sort-type="${SortType.RATING}">Sort by rating</a></li>
  </ul>`;
