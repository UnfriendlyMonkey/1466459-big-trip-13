import TripInfo from "./view/trip-info.js";
import TripTabs from "./view/trip-tabs.js";
import Stats from "./view/stats.js";
import TripEvents from "./view/trip-events";

import {remove, render} from "./utils/render.js";
import {TripTabsItem, UpdateType} from "./utils/const.js";
import {isOnline} from "./utils/common.js";
import {toast} from "./utils/toast/toast.js";

import TripListPresenter from "./presenter/trip-list.js";
import FilterPresenter from "./presenter/filters.js";
import TripPointsModel from "./model/trip-points.js";
import FilterModel from "./model/filter.js";

import Api from "./api/api.js";
import Store from "./api/store.js";
import Provider from "./api/provider.js";

const AUTHORIZATION = `Basic lniw4o87qhglaijgp938`;
const END_POINT = `https://13.ecmascript.pages.academy/big-trip`;
const STORE_PREFIX = `big-trip-localstorage`;
const STORE_VER = `v13`;
const STORE_NAME = `${STORE_PREFIX}-${STORE_VER}`;

const tripMainElement = document.querySelector(`.trip-main`);
const tripControlsElement = tripMainElement.querySelector(`.trip-controls`);
const tripTabsHeader = tripControlsElement.querySelectorAll(`h2`)[0];
const tripTabsComponent = new TripTabs();

const mainContainerElement = document.querySelector(`.page-main__container`);
const tripEventsElement = new TripEvents();

const api = new Api(END_POINT, AUTHORIZATION);
const store = new Store(STORE_NAME, window.localStorage);
const offersDestStore = new Store(`${STORE_NAME}-OFF-DEST`, window.localStorage);
const apiWithProvider = new Provider(api, store);
const offDestProvider = new Provider(api, offersDestStore);

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


const tripList = new TripListPresenter(tripEventsElement, pointsModel, filterModel, apiWithProvider);
const filterPresenter = new FilterPresenter(tripControlsElement, filterModel, pointsModel);

Promise.allSettled([
  offDestProvider.getOffers(),
  offDestProvider.getDestinations(),
  apiWithProvider.getPoints()
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
  if (!isOnline()) {
    toast(`You can't create new point offline`);
  } else {
    tripList.createPoint();
  }
  tripTabsComponent.setActiveTab(`TABLE`);
});

window.addEventListener(`load`, () => {
  navigator.serviceWorker.register(`/sw.js`);
});

window.addEventListener(`online`, () => {
  document.title = document.title.replace(` [offline]`, ``);
  apiWithProvider.sync();
});

window.addEventListener(`offline`, () => {
  document.title += ` [offline]`;
});
