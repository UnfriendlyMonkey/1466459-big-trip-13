import TripInfo from "./view/trip-info.js";
import TripTabs from "./view/trip-tabs.js";
import TripFilters from "./view/trip-filters.js";

import {generateEventItem} from "./mock/event-item.js";

import {render} from "./utils/render.js";
import {sortDate} from "./utils/list.js";

import TripListPresenter from "./presenter/trip-list";

const INITIAL_POINTS_NUMBER = 5;

const tripMainElement = document.querySelector(`.trip-main`);
const tripControlsElement = tripMainElement.querySelector(`.trip-controls`);
const tripTabsHeader = tripControlsElement.querySelectorAll(`h2`)[0];

const tripEventsElement = document.querySelector(`.trip-events`);

const eventItems = new Array(25).fill().map(generateEventItem);

const eventItemsList = eventItems.slice().sort(sortDate);
const pointsToGetTripInfo = eventItemsList.slice(0, INITIAL_POINTS_NUMBER);

render(tripMainElement, new TripInfo(pointsToGetTripInfo), `afterbegin`);
render(tripTabsHeader, new TripTabs(), `afterend`);
render(tripControlsElement, new TripFilters(), `beforeend`);

const TripList = new TripListPresenter(tripEventsElement);

TripList.init(pointsToGetTripInfo);

tripMainElement.querySelector(`.trip-main__event-add-btn`).addEventListener(`click`, TripList._eventAddButtonHandler);
