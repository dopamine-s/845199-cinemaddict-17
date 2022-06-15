export const MOVIES_PER_STEP = 5;

export const FILTER_TYPE = {
  ALL: 'All',
  WATCHLIST: 'Watchlist',
  HISTORY: 'History',
  FAVORITES: 'Favorites',
};

export const SORT_TYPE = {
  DEFAULT: 'default',
  DATE: 'date',
  RATING: 'rating',
};

export const EMOJIS = [
  'smile',
  'sleeping',
  'puke',
  'angry',
];

export const USER_ACTION = {
  UPDATE: 'UPDATE',
  ADD: 'ADD',
  DELETE: 'DELETE',
};

export const UPDATE_TYPE = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT',
};

export const NO_MOVIES_TEXTS = {
  [FILTER_TYPE.ALL]: 'There are no movies in our database',
  [FILTER_TYPE.WATCHLIST]: 'There are no movies in watchlist now',
  [FILTER_TYPE.HISTORY]: 'There are no already watched movies now',
  [FILTER_TYPE.FAVORITES]: 'There are no favorites movies now',
};
