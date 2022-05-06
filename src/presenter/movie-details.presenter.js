import MovieDetailsView from '../view/movie-details-view.js';
import { getCommentsByIds } from '../utils.js';
import { render } from '../render.js';

export default class MovieDetailsPresenter {

  init = (movieDetailsContainer, mockMoviesModel) => {
    this.movieDetailsContainer = movieDetailsContainer;
    this.mockMoviesModel = mockMoviesModel;
    this.movies = [...this.mockMoviesModel.getMockMoviesData()];
    this.comments = [...this.mockMoviesModel.getMockComments()];

    for (let i = 0; i < this.movies.length; i++) {
      const movieComments = getCommentsByIds(this.comments, this.movies[i].comments);

      render(new MovieDetailsView(
        this.movies[i],
        movieComments
      ), this.movieDetailsContainer);
    }
  };
}
