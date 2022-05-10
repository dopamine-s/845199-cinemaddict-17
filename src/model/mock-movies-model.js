import { generateMockMovieData, generateMockComments } from '../mock/mock-movie-data.js';

const MOCK_MOVIES_AMMOUNT = 20;
export const MAX_COMMENTS = 20;

export default class MockMoviesModel {
  #mockMoviesData = Array.from({ length: MOCK_MOVIES_AMMOUNT }, generateMockMovieData);
  #mockComments = generateMockComments(MAX_COMMENTS);

  get mockMoviesData() {
    return this.#mockMoviesData;
  }

  get mockMoviesComments() {
    return this.#mockComments;
  }
}
