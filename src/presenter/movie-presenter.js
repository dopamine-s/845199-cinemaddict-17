import MovieCardView from '../view/movie-card-view.js';
import MovieDetailsView from '../view/movie-details-view.js';
import { isEscapeKey } from '../utils/utils.js';
import { UserAction, UpdateType } from '../consts.js';
import { render, remove, RenderPosition, replace } from '../framework/render.js';

const siteFooterElement = document.querySelector('.footer');
const Mode = {
  DEFAULT: 'DEFAULT',
  DETAILS: 'DETAILS',
};

export default class MoviePresenter {
  #movieContainer = null;
  #moviesModel = null;
  #changeMovie = null;
  #changeMode = null;
  #movieCardComponent = null;
  #movieDetailsComponent = null;
  #movie = null;
  #comments = null;
  #mode = Mode.DEFAULT;

  constructor(movieContainer, moviesModel, changeMovie, changeMode) {
    this.#movieContainer = movieContainer;
    this.#moviesModel = moviesModel;
    this.#changeMovie = changeMovie;
    this.#changeMode = changeMode;
  }

  init = (movie, comments) => {
    this.#movie = movie;
    this.#comments = comments;
    const prevMovieCardComponent = this.#movieCardComponent;
    const prevMovieDetailsComponent = this.#movieDetailsComponent;

    this.#movieCardComponent = new MovieCardView(this.#movie, this.#comments);
    this.#movieDetailsComponent = new MovieDetailsView(this.#movie, this.#comments);

    this.#setMovieCardHandlers();
    this.#setMovieDetailsHandlers();

    if (prevMovieCardComponent === null || prevMovieDetailsComponent === null) {
      render(this.#movieCardComponent, this.#movieContainer);
      return;
    }

    replace(this.#movieCardComponent, prevMovieCardComponent);
    replace(this.#movieDetailsComponent, prevMovieDetailsComponent);

    remove(prevMovieCardComponent);
    remove(prevMovieDetailsComponent);
  };

  destroy = () => {
    remove(this.#movieCardComponent);
    remove(this.#movieDetailsComponent);
  };

  resetView = () => {
    if (this.#mode === Mode.DETAILS) {
      this.#movieDetailsComponent.reset(this.#movie);
      this.#handleCloseDetailsView();
    }
  };

  #setMovieCardHandlers = () => {
    this.#movieCardComponent.setDetailsClickHandler(this.#handleMovieCardClick);
    this.#movieCardComponent.setWatchlistClickHandler(this.#handleWatchlistClick);
    this.#movieCardComponent.setAlreadyWatchedClickHandler(this.#handleAlreadyWatchedClick);
    this.#movieCardComponent.setFavoriteClickHandler(this.#handleFavoriteClick);
  };

  #setMovieDetailsHandlers = () => {
    this.#movieDetailsComponent.setDeleteCommentClickHandler(this.#handleDeleteCommentClick);
    this.#movieDetailsComponent.setCloseDetailsClickHandler(this.#handleCloseDetailsView);
    this.#movieDetailsComponent.setWatchlistClickHandler(this.#handleWatchlistClick);
    this.#movieDetailsComponent.setAlreadyWatchedClickHandler(this.#handleAlreadyWatchedClick);
    this.#movieDetailsComponent.setFavoriteClickHandler(this.#handleFavoriteClick);
  };

  #handleCloseDetailsView = () => {
    remove(this.#movieDetailsComponent);
    this.#movieDetailsComponent.reset(this.#movie);

    document.body.classList.remove('hide-overflow');
    document.removeEventListener('keydown', this.#handleEscapeKeyDown);
    this.#mode = Mode.DEFAULT;
  };

  #handleEscapeKeyDown = (evt) => {
    if (isEscapeKey(evt)) {
      evt.preventDefault();
      this.#handleCloseDetailsView();
    }
  };

  #renderMovieDetails = () => {
    render(this.#movieDetailsComponent, siteFooterElement, RenderPosition.AFTEREND);
    this.#setMovieDetailsHandlers();
  };

  #handleMovieCardClick = () => {
    this.#changeMode();
    this.#renderMovieDetails();
    this.#mode = Mode.DETAILS;

    document.body.classList.add('hide-overflow');
    document.addEventListener('keydown', this.#handleEscapeKeyDown);
  };

  #handleDeleteCommentClick = (commentId) => {
    // console.log(comment);
    this.#moviesModel.deleteComment(
      UpdateType.MINOR,
      commentId
    );

    this.#changeMovie(
      UserAction.DELETE_COMMENT,
      UpdateType.MINOR,
      { ...this.#movie, comments: this.#movie.comments.filter((movieCommentId) => movieCommentId !== commentId), }, [...this.#comments]
    );
  };

  #handleWatchlistClick = () => {
    this.#changeMovie(
      UserAction.UPDATE_MOVIE,
      UpdateType.MINOR,
      { ...this.#movie, userDetails: { ...this.#movie.userDetails, watchlist: !this.#movie.userDetails.watchlist, } },
      [...this.#comments]);
  };

  #handleAlreadyWatchedClick = () => {
    this.#changeMovie(
      UserAction.UPDATE_MOVIE,
      UpdateType.MINOR,
      { ...this.#movie, userDetails: { ...this.#movie.userDetails, alreadyWatched: !this.#movie.userDetails.alreadyWatched, } },
      [...this.#comments]);
  };

  #handleFavoriteClick = () => {
    this.#changeMovie(
      UserAction.UPDATE_MOVIE,
      UpdateType.MINOR,
      { ...this.#movie, userDetails: {...this.#movie.userDetails, favorite: !this.#movie.userDetails.favorite,} },
      [...this.#comments]);
  };
}
