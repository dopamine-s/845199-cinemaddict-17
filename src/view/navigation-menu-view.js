import AbstractView from '../framework/view/abstract-view.js';
import { createNavigationMenuTemplate } from '../templates/navigation-menu-template.js';

export default class NavigationMenuView extends AbstractView{
  get template() {
    return createNavigationMenuTemplate();
  }
}
