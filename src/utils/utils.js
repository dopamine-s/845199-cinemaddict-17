import dayjs from 'dayjs';

// Функция из интернета по генерации случайного числа из диапазона
// Источник - https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore#_random
export const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

// функция возвращает случайный элемент из заданного массива
export const getRandomArrayElement = (elements) => elements[getRandomInteger(0, elements.length - 1)];

export const generateDate = (minDayGap, maxDayGap) => {
  const daysGap = getRandomInteger(minDayGap, maxDayGap);
  return dayjs().add(daysGap, 'day').toDate().toISOString();
};

export const humanizeDayDate = (data) => dayjs(data).format('D MMMM YYYY');
export const humanizeYearDate = (data) => dayjs(data).format('YYYY');
export const humanizeCommentDate = (data) => dayjs(data).format('YYYY/MM/DD HH:mm');
export const adaptCommentDate = (data) => {
  const dayDate = dayjs(data);
  const daysGap = dayjs().diff(dayDate, 'day');

  if (daysGap <= 1) {
    return 'Today';
  }
  if (daysGap > 1 && daysGap <= 30) {
    return `${daysGap} days ago`;
  }
  if (daysGap > 30) {
    return dayjs(data).format('YYYY/MM/DD HH:MM');
  }

  return dayjs(data).format('YYYY/MM/DD HH:MM');
};

export const getTimeFromMins = (mins) => {
  const hours = Math.trunc(mins / 60);
  const minutes = mins % 60;
  return `${hours}h ${minutes}m`;
};

export const getCommentsByIds = (allComments, singleMovieComments) => {
  const resultComments = [];
  for (const singleMovieComment of singleMovieComments) {
    resultComments.push(allComments.find((comment) => comment.id === singleMovieComment));
  }

  return resultComments;
};

export const isEscapeKey = (evt) => evt.key === 'Escape' || evt.key === 'Esc';

export const updateItem = (items, newItem) => {
  const index = items.findIndex((item) => item.id === newItem.id);

  if (index === -1) {
    return items;
  }

  return [
    ...items.slice(0, index),
    newItem,
    ...items.slice(index + 1),
  ];
};

// Функция помещает задачи без даты в конце списка,
// возвращая нужный вес для колбэка sort
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
