const createFilterItemTemplate = (filter, isChecked) => {
  const { name, count } = filter;
  if (isChecked) {
    return `<a href="#${name}" class="main-navigation__item main-navigation__item--active">${name}</a>`;
  }
  return `<a href="#${name}" class="main-navigation__item">${name}<span class="main-navigation__item-count">${count}</span></a>`;
};

export const createNavigationMenuTemplate = (filterItems) => {

  const filtersTemplate = filterItems.map((filter, index) => createFilterItemTemplate(filter, index === 0)).join('');
  return `<nav class="main-navigation"> ${filtersTemplate}</nav>`;
};
