import TripInfo from "./view/trip-info.js";
import TripTabs from "./view/trip-tabs.js";
import Stats from "./view/stats.js";
import TripEvents from "./view/trip-events";

import {remove, render} from "./utils/render.js";
import {TripTabsItem, UpdateType} from "./utils/const.js";

import TripListPresenter from "./presenter/trip-list.js";
import FilterPresenter from "./presenter/filters.js";
import TripPointsModel from "./model/trip-points.js";
import FilterModel from "./model/filter.js";

import Api from "./api.js";

const AUTHORIZATION = `Basic lniw4o87qhglaijgp938`;
const END_POINT = `https://13.ecmascript.pages.academy/big-trip`;

const tripMainElement = document.querySelector(`.trip-main`);
const tripControlsElement = tripMainElement.querySelector(`.trip-controls`);
const tripTabsHeader = tripControlsElement.querySelectorAll(`h2`)[0];
const tripTabsComponent = new TripTabs();

const mainContainerElement = document.querySelector(`.page-main__container`);
const tripEventsElement = new TripEvents();

const api = new Api(END_POINT, AUTHORIZATION);

const pointsModel = new TripPointsModel();
const filterModel = new FilterModel();

render(tripMainElement, new TripInfo(), `afterbegin`);
render(tripTabsHeader, tripTabsComponent, `afterend`);
render(mainContainerElement, tripEventsElement, `beforeend`);

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


const tripList = new TripListPresenter(tripEventsElement, pointsModel, filterModel, api);
const filterPresenter = new FilterPresenter(tripControlsElement, filterModel, pointsModel);

Promise.allSettled([
  api.getOffers(),
  api.getDestinations(),
  api.getPoints()
]).then((results) => {
  if (results[0].status === `fulfilled`) {
    pointsModel.setOffers(results[0].value);
  } else {
    throw new Error(results[0].reason);
  }

  if (results[1].status === `fulfilled`) {
    pointsModel.setDestinations(results[1].value);
  } else {
    throw new Error(results[1].reason);
  }

  if (results[2].status === `fulfilled`) {
    pointsModel.setPoints(UpdateType.INIT, results[2].value);
  } else {
    throw new Error(results[2].reason);
  }
});

filterPresenter.init();
tripList.init();

tripMainElement.querySelector(`.trip-main__event-add-btn`).addEventListener(`click`, (evt) => {
  evt.preventDefault();
  tripList.clear();
  if (statsElement) {
    remove(statsElement);
  }
  tripEventsElement.showElement();
  tripList.init();
  tripTabsComponent.setActiveTab(`TABLE`);
  tripList.createPoint();
});

window.addEventListener(`load`, () => {
  navigator.serviceWorker.register(`/sw.js`);
});
