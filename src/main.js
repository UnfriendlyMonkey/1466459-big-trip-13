import {createTripInfoTemplate} from "./view/trip-info.js";
import {createTripTabsTemplate} from "./view/trip-tabs.js";
import {createTripFiltersTemplate} from "./view/trip-filters.js";
import {createListSortTemplate} from "./view/list-sort.js";
import {createTripEventsListTemplate} from "./view/trip-event-list.js";
import {createTripEventItemTemplate} from "./view/trip-event-item.js";
import {createAddPointFormTemplate} from "./view/add-point.js";
import {createEditPointTemplate} from "./view/edit-point.js";

import {generateEventItem} from "./mock/event-item.js";

const INITIAL_POINTS_NO = 5;

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const tripMainElement = document.querySelector(`.trip-main`);
const tripControlsElement = tripMainElement.querySelector(`.trip-controls`);

const tripEventsElement = document.querySelector(`.trip-events`);

render(tripMainElement, createTripInfoTemplate(), `afterbegin`);
render(tripControlsElement, createTripTabsTemplate(), `afterbegin`);
render(tripControlsElement, createTripFiltersTemplate(), `beforeend`);
render(tripEventsElement, createListSortTemplate(), `beforeend`);
render(tripEventsElement, createTripEventsListTemplate(), `beforeend`);

const tripListElement = tripEventsElement.querySelector(`.trip-events__list`);

render(tripListElement, createAddPointFormTemplate(), `afterbegin`);

const eventItemsList = new Array(25).fill().map(generateEventItem);

render(tripListElement, createEditPointTemplate(eventItemsList[0]), `beforeend`);

for (let i = 1; i < INITIAL_POINTS_NO; i++) {
  render(tripListElement, createTripEventItemTemplate(eventItemsList[i]), `beforeend`);
}

// const eventItemsList = [];
// for (let i = 0; i < 20; i++) {
//   eventItemsList[i] = generateEventItem();
// }


console.log(eventItemsList);
