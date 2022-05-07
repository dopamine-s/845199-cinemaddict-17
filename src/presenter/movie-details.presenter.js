import MovieDetailsView from '../view/movie-details-view.js';
import { getCommentsByIds } from '../utils.js';
import { render } from '../render.js';

export default class MovieDetailsPresenter {

  init = (movieDetailsContainer, mockMoviesModel) => {
    this.movieDetailsContainer = movieDetailsContainer;
    this.mockMoviesModel = mockMoviesModel;
    this.movies = [...this.mockMoviesModel.getMockMoviesData()];
    this.comments = [...this.mockMoviesModel.getMockComments()];


    const movieComments = getCommentsByIds(this.comments, this.movies[0].comments);

    render(new MovieDetailsView(
      this.movies[0],
      movieComments
    ), this.movieDetailsContainer);
  };
}
