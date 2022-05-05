import dayjs from 'dayjs';

// Функция из интернета по генерации случайного числа из диапазона
// Источник - https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore#_random
const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

// функция возвращает случайный элемент из заданного массива
const getRandomArrayElement = (elements) => elements[getRandomInteger(0, elements.length - 1)];

const generateDate = (minDayGap, maxDayGap) => {
  const daysGap = getRandomInteger(minDayGap, maxDayGap);
  return dayjs().add(daysGap, 'day').toDate().toISOString();
};

const humanizeDayDate = (data) => dayjs(data).format('D MMMM YYYY');
const humanizeYearDate = (data) => dayjs(data).format('YYYY');
const humanizeCommentDate = (data) => dayjs(data).format('YYYY/MM/DD HH:mm');
const adaptCommentDate = (data) => {
  const dayDate = dayjs(data);
  const daysGap = dayjs().diff(dayDate, 'days');

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

const getTimeFromMins = (mins) => {
  const hours = Math.trunc(mins / 60);
  const minutes = mins % 60;
  return `${hours}h ${minutes}m`;
};

const getCommentsByIds = (allComments, singleMovieComments) => {
  const resultComments = [];
  console.log(singleMovieComments);
  console.log(allComments);
  for (const singleMovieComment of singleMovieComments) {
    resultComments.push(allComments.find((comment) => comment.id === singleMovieComment));
  }
  console.log(resultComments);
  return resultComments;
};

const generateId = () => Date.now().toString().substring(10) + getRandomInteger(Date.now().toString().substring(8), Date.now().toString().substring(6));

export { getRandomInteger, getRandomArrayElement, generateDate, humanizeDayDate, humanizeYearDate, humanizeCommentDate, adaptCommentDate, getTimeFromMins, generateId, getCommentsByIds };
