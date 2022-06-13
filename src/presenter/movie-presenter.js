import MovieCardView from '../view/movie-card-view.js';
import MovieDetailsView from '../view/movie-details-view.js';
import { isEscapeKey } from '../utils/utils.js';
import { USER_ACTION, UPDATE_TYPE } from '../consts.js';
import { render, remove, replace, RenderPosition } from '../framework/render.js';
import CommentPresenter from './comment-presenter.js';

const siteFooterElement = document.querySelector('.footer');
const Mode = {
  DEFAULT: 'DEFAULT',
  DETAILS: 'DETAILS',
};

export default class MoviePresenter {
  #movieContainer = null;
  #changeMovie = null;
  #changeMode = null;
  #commentsModel = null;
  #movieCardComponent = null;
  #movieDetailsComponent = null;
  #movie = null;
  #mode = Mode.DEFAULT;

  #commentPresenter = new Map();

  constructor(movieContainer, changeMovie, changeMode, commentsModel) {
    this.#movieContainer = movieContainer;
    this.#changeMovie = changeMovie;
    this.#changeMode = changeMode;
    this.#commentsModel = commentsModel;
  }

  init(movie) {
    this.#movie = movie;
    const prevMovieCardComponent = this.#movieCardComponent;
    const prevMovieDetailsComponent = this.#movieDetailsComponent;

    this.#movieCardComponent = new MovieCardView(movie);
    this.#movieDetailsComponent = new MovieDetailsView(movie, this.#renderComments, this.#getCommentsLength);

    this.#setMovieCardHandlers();
    this.#setMovieDetailsHandlers();

    if (prevMovieCardComponent === null || prevMovieDetailsComponent === null) {
      render(this.#movieCardComponent, this.#movieContainer);
      return;
    }

    if (this.#movieContainer.contains(prevMovieCardComponent.element)) {
      replace(this.#movieCardComponent, prevMovieCardComponent);
    }

    if (document.contains(prevMovieDetailsComponent.element)) {
      replace(this.#movieDetailsComponent, prevMovieDetailsComponent);
    }

    remove(prevMovieCardComponent);
    remove(prevMovieDetailsComponent);
    this.#renderComments();
  }

  destroy = () => {
    remove(this.#movieCardComponent);
    remove(this.#movieDetailsComponent);
  };

  #renderComment(comment) {
    console.log('коммент, приходящий в рендер коммента', comment);
    const commentPresenter = new CommentPresenter(this.#movieDetailsComponent.element.querySelector('.film-details__comments-list'), this.#changeMovie);
    commentPresenter.init(comment, this.#movie);
  }


  #renderComments = async () => {
    const movieId = this.#movie.id;
    await this.#commentsModel.getCommentsByMovieId(movieId);

    console.log('Список комментариев конкретного фильма, состоящий из их ID', this.#movie.comments);
    this.#movie.comments.forEach(
      (commentId) => this.#renderComment(this.#commentsModel.getComment(commentId))
    );
  };

  #getCommentsLength = () => this.#commentsModel.comments.length;

  #destroyComments() {
    this.#commentPresenter.forEach((presenter) => presenter.destroy());
  }

  resetView = () => {
    if (this.#mode === Mode.DETAILS) {
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
    this.#movieDetailsComponent.setCloseDetailsClickHandler(this.#handleCloseDetailsView);
    this.#movieDetailsComponent.setWatchlistClickHandler(this.#handleWatchlistClick);
    this.#movieDetailsComponent.setAlreadyWatchedClickHandler(this.#handleAlreadyWatchedClick);
    this.#movieDetailsComponent.setFavoriteClickHandler(this.#handleFavoriteClick);
    this.#movieDetailsComponent.setCommentAddHandler(this.#handleCommentAdd);
  };

  #handleCloseDetailsView = () => {
    this.#destroyComments();
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

  #addMovieDetails = () => {
    render(this.#movieDetailsComponent, siteFooterElement, RenderPosition.AFTEREND);
  };

  #handleMovieCardClick = () => {
    this.#changeMode();
    this.#addMovieDetails();
    this.#renderComments();
    this.#mode = Mode.DETAILS;

    document.body.classList.add('hide-overflow');
    document.addEventListener('keydown', this.#handleEscapeKeyDown);
  };

  #handleWatchlistClick = () => {
    this.#changeMovie(
      USER_ACTION.UPDATE,
      UPDATE_TYPE.PATCH,
      { ...this.#movie, userDetails: { ...this.#movie.userDetails, watchlist: !this.#movie.userDetails.watchlist, } });
  };

  #handleAlreadyWatchedClick = () => {
    this.#changeMovie(
      USER_ACTION.UPDATE,
      UPDATE_TYPE.PATCH,
      { ...this.#movie, userDetails: { ...this.#movie.userDetails, alreadyWatched: !this.#movie.userDetails.alreadyWatched, } });
  };

  #handleFavoriteClick = () => {
    this.#changeMovie(
      USER_ACTION.UPDATE,
      UPDATE_TYPE.PATCH,
      { ...this.#movie, userDetails: {...this.#movie.userDetails, favorite: !this.#movie.userDetails.favorite,} });
  };

  #handleCommentAdd = (update) => {
    this.#commentsModel.addComment(
      UPDATE_TYPE.PATCH,
      update
    );

    this.#changeMovie(USER_ACTION.UPDATE,
      UPDATE_TYPE.PATCH,
      {...this.#movie,  comments: [...this.#movie.comments, update.id]});
  };
}
