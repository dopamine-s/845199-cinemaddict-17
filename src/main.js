import UserRankView from './view/user-rank-view.js';
import NavigationMenuView from './view/navigation-menu-view.js';
import SortView from './view/sort-view.js';
import FilmsPresenter from './presenter/films-presenter.js';
import MoviesAmountView from './view/movies-amount-view.js';
import MovieDetailsPresenter from './presenter/movie-details.presenter.js';
import MockMoviesModel from './model/mock-movies-model.js';
import { render } from './render.js';

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const siteFooterElement = document.querySelector('.footer');
const filmsPresenter = new FilmsPresenter();
const movieDetailsPresenter = new MovieDetailsPresenter();
const mockMoviesModel = new MockMoviesModel();
const movies = mockMoviesModel.mockMoviesData;

render(new UserRankView(), siteHeaderElement);
render(new NavigationMenuView(), siteMainElement);
render(new SortView(), siteMainElement);

filmsPresenter.init(siteMainElement, mockMoviesModel);
movieDetailsPresenter.init(document.body, mockMoviesModel);

render(new MoviesAmountView(movies), siteFooterElement);
