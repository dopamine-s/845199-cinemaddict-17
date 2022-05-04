import { getRandomInteger, getRandomArrayElement, generateDate, generateId } from '../utils.js';

const generateMockCommentText = () => {
  const RANDOM_COMMENT_TEXTS = [
    'A film that changed my life, a true masterpiece, post-credit scene was just amazing omg.',
    'Полная дрянь. Не стоит вашего внимания',
    'Отличный фильм, жаль, что сейчас таких не снимают.',
    'Ужасно. Просто ужасно.',
    'Пойдет на раз.',
    'Не думаю, что захочу это пересматривать.',
  ];

  return getRandomArrayElement(RANDOM_COMMENT_TEXTS);
};

const generateMockCommentAuthor = () => {
  const RANDOM_COMMENT_AUTHORS = [
    'Ilya O\'Reilly',
    'Vasya3000',
    'Василий Алибабаевич',
    'Каролина Чаушеску',
    'John Doe',
    'Александр Матросов',
    'Мария',
    'Анна',
    'Павел'
  ];

  return getRandomArrayElement(RANDOM_COMMENT_AUTHORS);
};

const generateMockCommentEmotion = () => {
  const EMOJIS = [
    'smile',
    'sleeping',
    'puke',
    'angry',
  ];
  return getRandomArrayElement(EMOJIS);
};

const generateMockMovieComment = (id) => ({
  id,
  author: generateMockCommentAuthor(),
  comment: generateMockCommentText(),
  commentDate: generateDate(-1000, 0),
  emotion: generateMockCommentEmotion(),
});

export const generateMockComments = (commentsAmount) => {
  const mockComments = [];
  for (let id = 1; id <= commentsAmount; id++) {
    mockComments.push(generateMockMovieComment(id));
  }

  return mockComments;
};

const generateMockMovieDescription = () => {
  const MAX_DESCRIPTION_SENTENCES_NUMBER = 5;
  const DESCRIPTIONS = [
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    'Cras aliquet varius magna, non porta ligula feugiat eget.',
    'Aliquam id orci ut lectus varius viverra.',
    'Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.',
    'Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.',
    'Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.',
    'Sed sed nisi sed augue convallis suscipit in sed felis.',
    'Aliquam erat volutpat.',
    'Nunc fermentum tortor ac porta dapibus.',
    'In rutrum ac purus sit amet tempus.'
  ];

  const descriptionsList = [];
  const createSingleDescriptionSentence = () => {
    for (let i = 0; i <= DESCRIPTIONS.length - 1; i++) {
      let randomDescription = getRandomArrayElement(DESCRIPTIONS);

      while (descriptionsList.includes(randomDescription)) {
        randomDescription = getRandomArrayElement(DESCRIPTIONS);
      }

      descriptionsList.push(randomDescription);
      return ` ${randomDescription}`;
    }
  };

  const mockMovieDescription = String(Array.from({ length: getRandomInteger(1, MAX_DESCRIPTION_SENTENCES_NUMBER) }, createSingleDescriptionSentence));
  return mockMovieDescription.trim().split('.,').join('.');
};

const generateMockMoviePoster = () => {
  const posters = [
    './images/posters/made-for-each-other.png',
    './images/posters/popeye-meets-sinbad.png',
    './images/posters/sagebrush-trail.jpg',
    './images/posters/santa-claus-conquers-the-martians.jpg',
    './images/posters/the-dance-of-life.jpg',
    './images/posters/the-great-flamarion.jpg',
    './images/posters/the-man-with-the-golden-arm.jpg',
  ];

  return getRandomArrayElement(posters);
};

const generateMockMovieTitle = () => {
  const titles = [
    'Made For Each Other',
    'Popeye Meets Sinbad',
    'Sagebrush Trail',
    'Santa Claus Conquers The Martians',
    'The Dance Of Life',
    'The Great-Flamarion',
    'The Man With The Golden Arm',
  ];

  return getRandomArrayElement(titles);
};

export const generateMockMovieData = () => ({
  id: generateId(),
  comments: [1,2,3,4],

  filmInfo: {
    title: generateMockMovieTitle (),
    alternativeTitle: '',
    totalRating: `${getRandomInteger(5, 9)}.${getRandomInteger(0,9)}`,
    poster: generateMockMoviePoster(),
    ageRating: getRandomInteger(0, 18),
    director: 'Anthony Mann',
    writers: ['Anne Wigton, Heinz Herald, Richard Weil'],
    actors: ['Erich von Stroheim, Mary Beth Hughes, Dan Duryea'],
    release: {
      date: generateDate(-40000, 0),
      releaseCountry: 'USA'
    },
    runtime: getRandomInteger(30, 250),
    genre: ['Comedy', 'Drama'],
    description: generateMockMovieDescription(),
  },
  userDetails: {
    watchlist: Boolean(getRandomInteger(0, 2)),
    alreadyWatched: Boolean(getRandomInteger(0, 2)),
    watchingDate: generateDate(-1000, 0),
    favorite: Boolean(getRandomInteger(0, 2)),
  }
});
