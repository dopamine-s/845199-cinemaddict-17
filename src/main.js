import UserRankView from './view/user-rank-view.js';
import NavigationMenuView from './view/navigation-menu-view.js';
import FilmsPresenter from './presenter/films-presenter.js';
import MoviesAmountView from './view/movies-amount-view.js';
import MoviesModel from './model/movies-model.js';
import CommentsModel from './model/comments-model.js';
import { render } from './framework/render.js';
import { generateFilter } from './view/movie-filter.js';

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const siteFooterElement = document.querySelector('.footer');
const moviesModel = new MoviesModel();
const commentsModel = new CommentsModel();
const filmsPresenter = new FilmsPresenter(siteMainElement, moviesModel, commentsModel);
const movies = moviesModel.movies;
const filters = generateFilter(movies);

render(new UserRankView(), siteHeaderElement);
render(new NavigationMenuView(filters), siteMainElement);

filmsPresenter.init();

render(new MoviesAmountView(movies), siteFooterElement);
