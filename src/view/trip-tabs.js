import AbstractView from "./abstract.js";
import {TripTabsItem} from "../utils/const.js";

const createTripTabsTemplate = () => {
  return `<nav class="trip-controls__trip-tabs  trip-tabs">
    <a class="trip-tabs__btn  trip-tabs__btn--active" id="${TripTabsItem.TABLE}" href="#">Table</a>
    <a class="trip-tabs__btn" id="${TripTabsItem.STATS}" href="#">Stats</a>
  </nav>`;
};

export default class TripTabs extends AbstractView {
  constructor() {
    super();

    this.tabItems = this.getElement().querySelectorAll(`.trip-tabs__btn`);
    this._tabsClickHandler = this._tabsClickHandler.bind(this);
  }

  getTemplate() {
    return createTripTabsTemplate();
  }

  _tabsClickHandler(evt) {
    // evt.preventDefault();
    if (evt.target.classList.contains(`trip-tabs__btn`)) {
      this._callback.tabsClick(evt.target.id);
    }
  }

  setTabsClickHandler(callback) {
    this._callback.tabsClick = callback;
    this.getElement().addEventListener(`click`, this._tabsClickHandler);
  }

  setTabsItem(tabsItem) {
    const item = this.getElement().querySelector(`#${tabsItem}`);
    const activeItem = this.getElement().querySelector(`.trip-tabs__btn--active`);

    if (item !== null) {
      activeItem.classList.remove(`trip-tabs__btn--active`);
      item.classList.add(`trip-tabs__btn--active`);
    }
  }
}
