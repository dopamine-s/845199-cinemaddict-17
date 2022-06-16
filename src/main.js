// import UserRankView from './view/user-rank-view.js';
import FilmsPresenter from './presenter/films-presenter.js';
import FiltersPresenter from './presenter/filters-presenter.js';
import MoviesAmountPresenter from './presenter/movies-amount-pesenter.js';
import UserRankPresenter from './presenter/user-rank-presenter.js';
import MoviesModel from './model/movies-model.js';
import CommentsModel from './model/comments-model.js';
import FiltersModel from './model/filters-model.js';
import Api from './services/api';

const END_POINT = 'https://17.ecmascript.pages.academy/cinemaddict';
const AUTHORIZATION = 'Basic yh234BP971';

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const siteFooterElement = document.querySelector('.footer');

const api = new Api(END_POINT, AUTHORIZATION);
const moviesModel = new MoviesModel(api);
const commentsModel = new CommentsModel(api);

const userRankPresenter = new UserRankPresenter(siteHeaderElement, moviesModel);
const filtersModel = new FiltersModel();
const filmsPresenter = new FilmsPresenter(siteMainElement, moviesModel, commentsModel, filtersModel);
const filtersPresenter = new FiltersPresenter(siteMainElement, filtersModel, moviesModel);
const moviesAmountPresenter = new MoviesAmountPresenter(siteFooterElement, moviesModel);

userRankPresenter.init();
filtersPresenter.init();
filmsPresenter.init();
moviesModel.init();
moviesAmountPresenter.init();
