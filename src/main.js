import TripInfo from "./view/trip-info.js";
import TripTabs from "./view/trip-tabs.js";

import {generateEventItem} from "./mock/event-item.js";

import {render} from "./utils/render.js";
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

const tripEventsElement = document.querySelector(`.trip-events`);

const eventItems = new Array(25).fill().map(generateEventItem);

const eventItemsList = eventItems.slice().sort(sortByDate);
const pointsToGetTripInfo = eventItemsList.slice(0, INITIAL_POINTS_NUMBER);

const pointsModel = new TripPointsModel();
pointsModel.setPoints(pointsToGetTripInfo);

const filterModel = new FilterModel();

render(tripMainElement, new TripInfo(pointsToGetTripInfo), `afterbegin`);
render(tripTabsHeader, tripTabsComponent, `afterend`);

const tripList = new TripListPresenter(tripEventsElement, pointsModel, filterModel);
const filterPresenter = new FilterPresenter(tripControlsElement, filterModel, pointsModel);

const handleTabsClick = (tabsItem) => {
  console.log(tabsItem);
  tripTabsComponent.setTabsItem(tabsItem);
  switch (tabsItem) {
    case TripTabsItem.TABLE:
      console.log(`hide Stats, show Table`);
      break;
    case TripTabsItem.STATS:
      console.log(`hide Table, show Stats`);
      break;
  }
};

tripTabsComponent.setTabsClickHandler(handleTabsClick);

filterPresenter.init();
tripList.init();

tripMainElement.querySelector(`.trip-main__event-add-btn`).addEventListener(`click`, (evt) => {
  evt.preventDefault();
  tripList.createPoint();
});
