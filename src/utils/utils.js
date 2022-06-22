import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

dayjs.extend(duration);

export const humanizeDayDate = (data) => dayjs(data).format('D MMMM YYYY');
export const humanizeYearDate = (data) => dayjs(data).format('YYYY');
export const adaptCommentDate = (data) => {
  const MIN_DAYS_GAP = 1;
  const MAX_DAYS_GAP = 30;
  const dayDate = dayjs(data);
  const daysGap = dayjs().diff(dayDate, 'day');

  if (daysGap <= MIN_DAYS_GAP) {
    return 'Today';
  }
  if (daysGap > MIN_DAYS_GAP && daysGap <= MAX_DAYS_GAP) {
    return `${daysGap} days ago`;
  }
  if (daysGap > MAX_DAYS_GAP) {
    return dayjs(data).format('YYYY/MM/DD HH:MM');
  }

  return dayjs(data).format('YYYY/MM/DD HH:MM');
};

export const getTimeFromMins = (timeInMinutes) => dayjs.duration(timeInMinutes, 'minutes').format('H[h] m[min]');

export const isEscapeKey = (evt) => evt.key === 'Escape' || evt.key === 'Esc';

const getWeightForNullData = (dataA, dataB) => {
  if (dataA === null && dataB === null) {
    return 0;
  }

  if (dataA === null) {
    return 1;
  }

  if (dataB === null) {
    return -1;
  }

  return null;
};

export const sortMovieByDate = (movieA, movieB) => {
  const weight = getWeightForNullData(movieA.filmInfo.release.date, movieB.filmInfo.release.date);

  return weight ?? dayjs(movieA.filmInfo.release.date).diff(dayjs(movieB.filmInfo.release.date));
};

export const sortMovieByRating = (movieA, movieB) => {
  const weight = getWeightForNullData(movieA.filmInfo.totalRating, movieB.filmInfo.totalRating);

  return weight ?? movieB.filmInfo.totalRating - movieA.filmInfo.totalRating;
};
