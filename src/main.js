import FilmsPresenter from './presenter/films-presenter.js';
import FiltersPresenter from './presenter/filters-presenter.js';
import MoviesAmountPresenter from './presenter/movies-amount-pesenter.js';
import UserRankPresenter from './presenter/user-rank-presenter.js';
import MoviesModel from './model/movies-model.js';
import CommentsModel from './model/comments-model.js';
import FiltersModel from './model/filters-model.js';
import {Api, END_POINT, AUTHORIZATION} from './services/api.js';

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const siteFooterElement = document.querySelector('.footer');

const api = new Api(END_POINT, AUTHORIZATION);
const moviesModel = new MoviesModel(api);
const commentsModel = new CommentsModel(api);
const filtersModel = new FiltersModel();

const userRankPresenter = new UserRankPresenter(siteHeaderElement, moviesModel);
const filmsPresenter = new FilmsPresenter(siteMainElement, moviesModel, commentsModel, filtersModel);
const filtersPresenter = new FiltersPresenter(siteMainElement, filtersModel, moviesModel);
const moviesAmountPresenter = new MoviesAmountPresenter(siteFooterElement, moviesModel);

userRankPresenter.init();
filtersPresenter.init();
filmsPresenter.init();
moviesModel.init();
moviesAmountPresenter.init();
