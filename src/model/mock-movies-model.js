import { generateMockMovieData, generateMockComments } from '../mock/mock-movie-data.js';

const MOCK_MOVIES_AMMOUNT = 20;
const MAX_COMMENTS = 20;

export default class MockMoviesModel {
  getMockMoviesData = () => Array.from({ length: MOCK_MOVIES_AMMOUNT }, generateMockMovieData);
  getMockComments = () => generateMockComments(MAX_COMMENTS);
}
