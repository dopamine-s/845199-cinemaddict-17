const createFilterItemTemplate = (filter, currentFilterType) => {
  const { type, name, count } = filter;
  return (
    `<a href="#${name}" class="main-navigation__item ${type === currentFilterType ? 'main-navigation__item--active' : ''}" data-filter-type="${name}">${name} <span class="main-navigation__item-count">${count}</span></a>`
  );
};

export const createNavigationMenuTemplate = (filterItems) => {

  const filtersTemplate = filterItems.map((filter, index) => createFilterItemTemplate(filter, index === 0)).join('');
  return `<nav class="main-navigation"> ${filtersTemplate}</nav>`;
};
