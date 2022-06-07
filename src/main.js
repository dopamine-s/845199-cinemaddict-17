import UserRankView from './view/user-rank-view.js';
import FilmsPresenter from './presenter/films-presenter.js';
import FiltersPresenter from './presenter/filters-presenter.js';
import MoviesAmountView from './view/movies-amount-view.js';
import MoviesModel from './model/movies-model.js';
import CommentsModel from './model/comments-model.js';
import FiltersModel from './model/filters-model.js';
import { render } from './framework/render.js';

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const siteFooterElement = document.querySelector('.footer');
const moviesModel = new MoviesModel();
const commentsModel = new CommentsModel();
const filtersModel = new FiltersModel();
const filmsPresenter = new FilmsPresenter(siteMainElement, moviesModel, commentsModel, filtersModel);
const filtersPresenter = new FiltersPresenter(siteMainElement, filtersModel, moviesModel);
const movies = moviesModel.movies;

render(new UserRankView(), siteHeaderElement);

filtersPresenter.init();
filmsPresenter.init();

render(new MoviesAmountView(movies), siteFooterElement);
