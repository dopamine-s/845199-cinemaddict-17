import Observable from '../framework/observable.js';
import { generateMockMovieData, generateMockComments } from '../mock/mock-movie-data.js';

const MOCK_MOVIES_AMMOUNT =30;
export const MAX_COMMENTS = 20;

export default class MoviesModel extends Observable {
  #movies = Array.from({ length: MOCK_MOVIES_AMMOUNT }, generateMockMovieData);
  #comments = generateMockComments(MAX_COMMENTS);

  get movies() {
    return this.#movies;
  }

  get comments() {
    return this.#comments;
  }
}
