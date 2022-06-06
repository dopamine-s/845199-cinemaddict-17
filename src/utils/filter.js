import { FILTER_TYPE } from '../consts.js';

export const filter = {
  [FILTER_TYPE.ALL]: (movies) => movies,
  [FILTER_TYPE.WATCH_LIST]: (movies) => movies.filter((movie) => movie.userDetails.watchlist),
  [FILTER_TYPE.HISTORY]: (movies) => movies.filter((movie) => movie.userDetails.alreadyWatched),
  [FILTER_TYPE.FAVORITES]: (movies) => movies.filter((movie) => movie.userDetails.favorite)
};
