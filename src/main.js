import {createTripInfoTemplate} from "./view/trip-info.js";
import TripTabs from "./view/trip-tabs.js";
import {createTripFiltersTemplate} from "./view/trip-filters.js";
import ListSort from "./view/list-sort.js";
import {createTripEventsListTemplate} from "./view/trip-event-list.js";
import {createTripEventItemTemplate} from "./view/trip-event-item.js";
import {createAddPointFormTemplate} from "./view/add-point.js";
import {createEditPointTemplate} from "./view/edit-point.js";

import {generateEventItem} from "./mock/event-item.js";

import {renderTemplate, renderElement} from "./util.js";

const INITIAL_POINTS_NUMBER = 5;

const tripMainElement = document.querySelector(`.trip-main`);
const tripControlsElement = tripMainElement.querySelector(`.trip-controls`);
const tripTabsHeader = tripControlsElement.querySelectorAll(`h2`)[0];

const tripEventsElement = document.querySelector(`.trip-events`);

const eventItems = new Array(25).fill().map(generateEventItem);

const eventItemsList = eventItems.slice().sort(function (a, b) {
  return a.startTime - b.startTime;
});

renderTemplate(tripMainElement, createTripInfoTemplate(eventItemsList.slice(0, INITIAL_POINTS_NUMBER)), `afterbegin`);
// renderTemplate(tripControlsElement, createTripTabsTemplate(), `afterbegin`);
// tripTabsHeader.classList.remove(`visually-hidden`);
renderElement(tripTabsHeader, new TripTabs().getElement(), `afterend`);
renderTemplate(tripControlsElement, createTripFiltersTemplate(), `beforeend`);
// renderTemplate(tripEventsElement, createListSortTemplate(), `beforeend`);
renderElement(tripEventsElement, new ListSort().getElement(), `beforeend`);
renderTemplate(tripEventsElement, createTripEventsListTemplate(), `beforeend`);

const tripListElement = tripEventsElement.querySelector(`.trip-events__list`);

renderTemplate(tripListElement, createAddPointFormTemplate(), `afterbegin`);

renderTemplate(tripListElement, createEditPointTemplate(eventItemsList[0]), `beforeend`);

for (let i = 1; i < INITIAL_POINTS_NUMBER; i++) {
  renderTemplate(tripListElement, createTripEventItemTemplate(eventItemsList[i]), `beforeend`);
}
