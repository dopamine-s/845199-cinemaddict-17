import { render, replace, remove } from '../framework/render.js';
import FiltersView from '../view/filters-view.js';
import { filter } from '../utils/filter.js';
import { FILTER_TYPE, UPDATE_TYPE } from '../consts.js';

export default class FiltersPresenter {
  #filterContainer = null;
  #filtersModel = null;
  #moviesModel = null;

  #filterComponent = null;

  constructor(filterContainer, filtersModel, moviesModel) {
    this.#filterContainer = filterContainer;
    this.#filtersModel = filtersModel;
    this.#moviesModel = moviesModel;

    this.#moviesModel.addObserver(this.#handleModelEvent);
    this.#filtersModel.addObserver(this.#handleModelEvent);
  }

  get filters() {
    const movies = this.#moviesModel.movies;

    return [
      {
        type: FILTER_TYPE.ALL,
        name: 'All',
        count: filter[FILTER_TYPE.ALL](movies).length,
      },
      {
        type: FILTER_TYPE.WATCHLIST,
        name: 'Watchlist',
        count: filter[FILTER_TYPE.WATCHLIST](movies).length,
      },
      {
        type: FILTER_TYPE.HISTORY,
        name: 'History',
        count: filter[FILTER_TYPE.HISTORY](movies).length,
      },
      {
        type: FILTER_TYPE.FAVORITES,
        name: 'Favorites',
        count: filter[FILTER_TYPE.FAVORITES](movies).length,
      },
    ];
  }

  init() {
    const filters = this.filters;
    const prevFilterComponent = this.#filterComponent;

    this.#filterComponent = new FiltersView(filters, this.#filtersModel.filter);
    this.#filterComponent.setFilterTypeChangeHandler(this.#handleFilterTypeChange);

    if (prevFilterComponent === null) {
      render(this.#filterComponent, this.#filterContainer);
      return;
    }

    replace(this.#filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  }

  #handleModelEvent = () => {
    this.init();
  };

  #handleFilterTypeChange = (filterType) => {
    if (this.#filtersModel.filter === filterType) {
      return;
    }

    this.#filtersModel.setFilter(UPDATE_TYPE.MAJOR, filterType);
  };

}
