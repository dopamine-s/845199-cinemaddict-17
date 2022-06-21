import MovieCardView from '../view/movie-card-view.js';
import MovieDetailsContainerView from '../view/movie-details-container-view.js';
import MovieDetailsView from '../view/movie-details-view.js';
import { isEscapeKey } from '../utils/utils.js';
import { USER_ACTION, UPDATE_TYPE } from '../consts.js';
import { render, remove, replace, RenderPosition } from '../framework/render.js';

const siteFooterElement = document.querySelector('.footer');
const Mode = {
  DEFAULT: 'DEFAULT',
  DETAILS: 'DETAILS',
};

export default class MoviePresenter {
  #comments = [];
  #movieContainer = null;
  #changeMovie = null;
  #changeMode = null;
  #commentsModel = null;
  #movieCardComponent = null;
  #movieDetailsContainerComponent = null;
  #movieDetailsComponent = null;
  #mode = Mode.DEFAULT;
  #scrollTopMovieDetails = null;
  #updatedMovie = null;
  #prevMovieCardComponent = null;
  #prevMovieDetailsComponent = null;

  constructor(movieContainer, changeMovie, changeMode, commentsModel) {
    this.#movieContainer = movieContainer;
    this.#changeMovie = changeMovie;
    this.#changeMode = changeMode;
    this.#commentsModel = commentsModel;
  }

  init (movie) {
    this.movie = movie;
    this.#comments = this.#commentsModel.comments;
    this.#prevMovieCardComponent = this.#movieCardComponent;
    this.#prevMovieDetailsComponent = this.#movieDetailsComponent;

    this.#movieCardComponent = new MovieCardView(this.movie);
    this.#movieDetailsComponent = new MovieDetailsView(this.movie, []);
    this.#movieDetailsContainerComponent = new MovieDetailsContainerView();

    this.#setMovieCardHandlers();
    this.#setMovieDetailsHandlers();

    if (this.#prevMovieCardComponent === null && this.#prevMovieDetailsComponent === null) {
      return  render(this.#movieCardComponent, this.#movieContainer);
    }

    if (!this.isModeDetails()) {
      replace(this.#movieCardComponent, this.#prevMovieCardComponent);
      remove(this.#prevMovieCardComponent);
    }

    if (this.isModeDetails()) {
      this.#replaceMovieDetailsComponent(this.#comments);
    }
  }

  destroy = () => {
    remove(this.#movieCardComponent);
    remove(this.#movieDetailsComponent);
  };

  movieCardDestroy = () => {
    remove(this.#movieCardComponent);
  };

  resetView = () => {
    if (this.#mode === Mode.DETAILS) {
      this.#handleCloseDetailsView();
    }
  };

  isModeDetails = () => this.#mode === Mode.DETAILS;

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
    this.#movieDetailsComponent.setDeleteCommentHandler(this.#handleDeleteComment);
    this.#movieDetailsComponent.setAddCommentHandler(this.#handleAddComment);
  };

  #handleMovieCardClick = () => {
    if (this.#mode === Mode.DEFAULT) {
      this.#addMovieDetails();
      document.addEventListener('keydown', this.#handleEscapeKeyDown);
      this.#changeMode();
      this.#mode = Mode.DETAILS;
      this.#getComments();
    }
  };

  #getComments = async () => {
    const comments = await this.#commentsModel.getCommentsByMovieId(this.movie.id);
    this.#prevMovieDetailsComponent = this.#movieDetailsComponent;
    this.#replaceMovieDetailsComponent(comments);
  };

  #handleCloseDetailsView = () => {
    this.#mode = Mode.DEFAULT;
    this.#movieDetailsComponent.reset(this.movie);
    this.#movieDetailsComponent.element.remove();
    this.#movieDetailsContainerComponent.element.remove();
    document.removeEventListener('keydown', this.#handleEscapeKeyDown);
  };

  #handleEscapeKeyDown = (evt) => {
    if (isEscapeKey(evt)) {
      evt.preventDefault();
      document.body.classList.remove('hide-overflow');
      this.#handleCloseDetailsView();
    }
  };

  #addMovieDetails = () => {
    render(this.#movieDetailsContainerComponent, siteFooterElement, RenderPosition.AFTEREND);
    render(this.#movieDetailsComponent, this.#movieDetailsContainerComponent.element);
  };

  #handleWatchlistClick = async () => {
    try {
      await this.#changeMovie(
        USER_ACTION.UPDATE,
        UPDATE_TYPE.MINOR,
        {
          ...this.movie, userDetails: {
            ...this.movie.userDetails, watchlist: !this.movie.userDetails.watchlist,
          }
        });
    } catch {
      this.#setAborting();
    }
  };

  #handleAlreadyWatchedClick = async () => {
    try {
      await this.#changeMovie(
        USER_ACTION.UPDATE,
        UPDATE_TYPE.MINOR,
        {
          ...this.movie, userDetails: {
            ...this.movie.userDetails, alreadyWatched: !this.movie.userDetails.alreadyWatched,
          }
        });
    } catch {
      this.#setAborting();
    }
  };

  #handleFavoriteClick = async () => {
    try {
      await this.#changeMovie(
        USER_ACTION.UPDATE,
        UPDATE_TYPE.MINOR,
        { ...this.movie, userDetails:
        {...this.movie.userDetails, favorite: !this.movie.userDetails.favorite,
        }
        });
    } catch {
      this.#setAborting();
    }
  };

  #handleAddComment = async (update) => {
    try {
      this.#updatedMovie = await this.#commentsModel.addComment(this.movie.id, update);

      this.#changeMovie(
        USER_ACTION.ADD,
        UPDATE_TYPE.MINOR,
        this.#updatedMovie
      );
    } catch (err) {
      this.#setAborting();
    }
  };

  #handleDeleteComment = async (commentId) => {
    try {
      await this.#commentsModel.deleteComment(
        UPDATE_TYPE.MINOR,
        commentId
      );

      this.#changeMovie(
        USER_ACTION.DELETE,
        UPDATE_TYPE.MINOR,
        {
          ...this.movie,
          comments: this.movie.comments.filter((movieCommentId) => movieCommentId !== commentId),
        }
      );
    } catch {
      this.#setAborting();
    }
  };

  #replaceMovieDetailsComponent = (comments) => {
    this.#scrollTopMovieDetails = this.#prevMovieDetailsComponent.element.scrollTop;
    this.#movieDetailsComponent = new MovieDetailsView(this.movie, comments);
    this.#setMovieDetailsHandlers();
    replace(this.#movieDetailsComponent, this.#prevMovieDetailsComponent);
    this.#movieDetailsComponent.element.scrollTop = this.#scrollTopMovieDetails;
    remove(this.#prevMovieDetailsComponent);
  };

  #setAborting = () => {
    if (this.isModeDetails()) {
      const resetMovieDetails = () => {
        this.#movieDetailsComponent.updateElement({
          isDisabled: false,
          isDeletingComment: false,
          isAddingComment: false
        });
      };

      this.#movieDetailsComponent.shake(resetMovieDetails);
      return true;
    }

    const resetMovie = () => {
      this.#movieCardComponent.updateElement({
        isDisabled: false
      });
    };
    this.#movieCardComponent.shake(resetMovie);
  };
}
