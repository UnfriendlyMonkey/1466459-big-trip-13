import TripInfo from "./view/trip-info.js";
import TripTabs from "./view/trip-tabs.js";
import Stats from "./view/stats.js";
import TripEvents from "./view/trip-events";

import {generateEventItem} from "./mock/event-item.js";

import {remove, render} from "./utils/render.js";
import {sortByDate} from "./utils/list.js";
import {INITIAL_POINTS_NUMBER, TripTabsItem} from "./utils/const.js";

import TripListPresenter from "./presenter/trip-list.js";
import FilterPresenter from "./presenter/filters.js";
import TripPointsModel from "./model/trip-points.js";
import FilterModel from "./model/filter.js";

const tripMainElement = document.querySelector(`.trip-main`);
const tripControlsElement = tripMainElement.querySelector(`.trip-controls`);
const tripTabsHeader = tripControlsElement.querySelectorAll(`h2`)[0];
const tripTabsComponent = new TripTabs();

const mainContainerElement = document.querySelector(`.page-main__container`);
const tripEventsElement = new TripEvents();

const eventItems = new Array(25).fill().map(generateEventItem);

const eventItemsList = eventItems.slice().sort(sortByDate);
const pointsToGetTripInfo = eventItemsList.slice(0, INITIAL_POINTS_NUMBER);

const pointsModel = new TripPointsModel();
pointsModel.setPoints(pointsToGetTripInfo);

const filterModel = new FilterModel();

render(tripMainElement, new TripInfo(pointsToGetTripInfo), `afterbegin`);
render(tripTabsHeader, tripTabsComponent, `afterend`);
render(mainContainerElement, tripEventsElement, `beforeend`);

const tripList = new TripListPresenter(tripEventsElement, pointsModel, filterModel);
const filterPresenter = new FilterPresenter(tripControlsElement, filterModel, pointsModel);
let statsElement = null;

const handleTabsClick = (tabsItem) => {
  tripTabsComponent.setActiveTab(tabsItem);
  switch (tabsItem) {
    case TripTabsItem.TABLE:
      tripList.destroy();
      tripEventsElement.showElement();
      tripList.init();
      remove(statsElement);
      break;
    case TripTabsItem.STATS:
      tripEventsElement.hideElement();
      statsElement = new Stats(pointsModel.getPoints());
      render(mainContainerElement, statsElement, `beforeend`);
      statsElement.showElement();
      tripList.destroy();
      break;
  }
};

tripTabsComponent.setTabsClickHandler(handleTabsClick);

filterPresenter.init();
tripList.init();

tripMainElement.querySelector(`.trip-main__event-add-btn`).addEventListener(`click`, (evt) => {
  evt.preventDefault();
  tripList.destroy();
  if (statsElement) {
    remove(statsElement);
  }
  tripEventsElement.showElement();
  tripList.init();
  tripTabsComponent.setActiveTab(`TABLE`);
  tripList.createPoint();
});
