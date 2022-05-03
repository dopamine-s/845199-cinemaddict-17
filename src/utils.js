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

const humanizeDayDate = (data) => dayjs(data).format('D MMMM YYYY');
const humanizeYearDate = (data) => dayjs(data).format('YYYY');
const humanizeCommentDate = (data) =>dayjs(data).format('YYYY/MM/DD HH:mm');

const getTimeFromMins = (mins) => {
  const hours = Math.trunc(mins / 60);
  const minutes = mins % 60;
  return `${hours}h ${minutes}m`;
};

export { getRandomInteger, getRandomArrayElement, humanizeDayDate, humanizeYearDate, humanizeCommentDate, getTimeFromMins };
