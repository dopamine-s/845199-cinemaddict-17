import UserRankView from './view/user-rank-view.js';
import NavigationMenuView from './view/navigation-menu-view.js';
import FilmsPresenter from './presenter/films-presenter.js';
import MoviesAmountView from './view/movies-amount-view.js';
import MockMoviesModel from './model/mock-movies-model.js';
import { render } from './framework/render.js';
import { generateFilter } from './mock/filter.js';

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const siteFooterElement = document.querySelector('.footer');
const mockMoviesModel = new MockMoviesModel();
const filmsPresenter = new FilmsPresenter(siteMainElement, mockMoviesModel);
const movies = mockMoviesModel.mockMoviesData;
const filters = generateFilter(movies);

render(new UserRankView(), siteHeaderElement);
render(new NavigationMenuView(filters), siteMainElement);

filmsPresenter.init();

render(new MoviesAmountView(movies), siteFooterElement);
