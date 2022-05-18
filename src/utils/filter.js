import { FilterType } from '../consts.js';

export const filter = {
  [FilterType.ALL]: (movies) => movies,
  [FilterType.WATCH_LIST]: (movies) => movies.filter((movie) => movie.userDetails.watchlist),
  [FilterType.HISTORY]: (movies) => movies.filter((movie) => movie.userDetails.alreadyWatched),
  [FilterType.FAVORITES]: (movies) => movies.filter((movie) => movie.userDetails.favorite)
};
