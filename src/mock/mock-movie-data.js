import { getRandomInteger, getRandomArrayElement } from '../utils.js';

const generateMockCommentText = () => {
  const randomCommentTexts = [
    'A film that changed my life, a true masterpiece, post-credit scene was just amazing omg.',
    'Полная дрянь. Не стоит вашего внимания',
    'Отличный фильм, жаль, что сейчас таких не снимают.',
    'Ужасно. Просто ужасно.',
    'Пойдет на раз.',
    'Не думаю, что захочу это пересматривать.',
  ];

  return getRandomArrayElement(randomCommentTexts);
};

const generateMockCommentAuthor = () => {
  const randomCommentAuthors = [
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

  return getRandomArrayElement(randomCommentAuthors);
};

const generateMockMovieComment = (id) => ({
  id,
  author: generateMockCommentAuthor(),
  comment: generateMockCommentText(),
  commentDate: '2019-05-11T16:12:32.554Z',
  emotion: {
    smile: true,
    sleeping: false,
    puke: false,
    angry: false,
  },
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
  const descriptions = [
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
    for (let i = 0; i <= descriptions.length - 1; i++) {
      let randomDescription = getRandomArrayElement(descriptions);

      while (descriptionsList.includes(randomDescription)) {
        randomDescription = getRandomArrayElement(descriptions);
      }

      descriptionsList.push(randomDescription);
      return ` ${randomDescription}`;
    }
  };

  const mockMovieDescription = String(Array.from({ length: getRandomInteger(1, MAX_DESCRIPTION_SENTENCES_NUMBER) }, createSingleDescriptionSentence));
  const mockMovieDescriptionString = mockMovieDescription.replace( /.,/g, '.');
  return mockMovieDescriptionString.trim();
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
  id: 1,
  comments: [1,2,3],

  filmInfo: {
    title: generateMockMovieTitle (),
    alternativeTitle: '',
    totalRating: 8.9,
    poster: generateMockMoviePoster(),
    ageRating: 0,
    director: 'Anthony Mann',
    writers: ['Anne Wigton, Heinz Herald, Richard Weil'],
    actors: ['Erich von Stroheim, Mary Beth Hughes, Dan Duryea'],
    release: {
      date: '2019-05-11T00:00:00.000Z',
      releaseCountry: 'USA'
    },
    runtime: 177,
    genre: ['Comedy', 'Drama'],
    description: generateMockMovieDescription(),
  },
  userDetails: {
    watchlist: false,
    alreadyWatched: false,
    watchingDate: '2019-04-12T16:12:32.554Z',
    favorite: false
  }
});
