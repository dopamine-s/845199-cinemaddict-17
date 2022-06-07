import { NO_MOVIES_TEXTS } from '../consts';

export const createNoMoviesTemplate = (filterType) => {
  const noMoviesTextValue = NO_MOVIES_TEXTS[filterType];

  return (
    `<h2 class="films-list__title">
      ${noMoviesTextValue}
    </h2>`);
};
