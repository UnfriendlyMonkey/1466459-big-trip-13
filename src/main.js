import {createTripInfoTemplate} from "./view/trip-info.js";
import {createTripTabsTemplate} from "./view/trip-tabs.js";
import {createTripFiltersTemplate} from "./view/trip-filters.js";
import {createListSortTemplate} from "./view/list-sort.js";
import {createListTemplate} from "./view/list.js";
import {createListItemTemplate} from "./view/list-item.js";
import {createAddPointTemplate} from "./view/add-point.js";
import {createEditPointTemplate} from "./view/edit-point.js";

const INITIAL_POINTS_NO = 3;

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
render(tripEventsElement, createListTemplate(), `beforeend`);

const tripListElement = tripEventsElement.querySelector(`.trip-events__list`);

render(tripListElement, createAddPointTemplate(), `afterbegin`);

render(tripListElement, createEditPointTemplate(), `beforeend`);

for (let i = 0; i < INITIAL_POINTS_NO; i++) {
  render(tripListElement, createListItemTemplate(), `beforeend`);
}
