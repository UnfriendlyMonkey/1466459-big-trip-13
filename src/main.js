import TripInfo from "./view/trip-info.js";
import TripTabs from "./view/trip-tabs.js";
import TripFilters from "./view/trip-filters.js";
import ListSort from "./view/list-sort.js";
import TripEventsList from "./view/trip-event-list.js";
import {createTripEventItemTemplate} from "./view/trip-event-item.js";
import {createAddPointFormTemplate} from "./view/add-point.js";
import {createEditPointTemplate} from "./view/edit-point.js";

import {generateEventItem} from "./mock/event-item.js";

import {renderTemplate, renderElement} from "./util.js";

const INITIAL_POINTS_NUMBER = 3;

const tripMainElement = document.querySelector(`.trip-main`);
const tripControlsElement = tripMainElement.querySelector(`.trip-controls`);
const tripTabsHeader = tripControlsElement.querySelectorAll(`h2`)[0];

const tripEventsElement = document.querySelector(`.trip-events`);

const eventItems = new Array(25).fill().map(generateEventItem);

const eventItemsList = eventItems.slice().sort(function (a, b) {
  return a.startTime - b.startTime;
});
const pointsToGetTripInfo = eventItemsList.slice(0, INITIAL_POINTS_NUMBER);

renderElement(tripMainElement, new TripInfo(pointsToGetTripInfo).getElement(), `afterbegin`);
renderElement(tripTabsHeader, new TripTabs().getElement(), `afterend`);
renderElement(tripControlsElement, new TripFilters().getElement(), `beforeend`);
renderElement(tripEventsElement, new ListSort().getElement(), `beforeend`);
const tripListComponent = new TripEventsList();
renderElement(tripEventsElement, tripListComponent.getElement(), `beforeend`);

renderTemplate(tripListComponent.getElement(), createAddPointFormTemplate(), `afterbegin`);

renderTemplate(tripListComponent.getElement(), createEditPointTemplate(eventItemsList[0]), `beforeend`);

for (let i = 1; i < INITIAL_POINTS_NUMBER; i++) {
  renderTemplate(tripListComponent.getElement(), createTripEventItemTemplate(eventItemsList[i]), `beforeend`);
}
