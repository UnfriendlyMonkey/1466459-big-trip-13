import TripInfo from "./view/trip-info.js";
import TripTabs from "./view/trip-tabs.js";
import TripFilters from "./view/trip-filters.js";
import ListSort from "./view/list-sort.js";
import TripEventsList from "./view/trip-event-list.js";
import TripEventItem from "./view/trip-event-item.js";
import AddPointForm from "./view/add-point.js";
import EditPoint from "./view/edit-point.js";

import {generateEventItem} from "./mock/event-item.js";

import {render} from "./util.js";

const INITIAL_POINTS_NUMBER = 5;

const renderPoint = (tripListElement, point) => {
  const pointComponent = new TripEventItem(point);
  const pointEditComponent = new EditPoint(point);

  const showEditForm = () => {
    tripListElement.replaceChild(pointEditComponent.getElement(), pointComponent.getElement());
  };
  const hideEditForm = () => {
    tripListElement.replaceChild(pointComponent.getElement(), pointEditComponent.getElement());
  };

  pointComponent.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, () => {
    showEditForm();
  });

  pointEditComponent.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, () => {
    hideEditForm();
  });

  pointEditComponent.getElement().querySelector(`.event--edit`).addEventListener(`submit`, () => {
    hideEditForm();
  });

  render(tripListElement, pointComponent.getElement(), `beforeend`);
};

const tripMainElement = document.querySelector(`.trip-main`);
const tripControlsElement = tripMainElement.querySelector(`.trip-controls`);
const tripTabsHeader = tripControlsElement.querySelectorAll(`h2`)[0];

const tripEventsElement = document.querySelector(`.trip-events`);

const eventItems = new Array(25).fill().map(generateEventItem);

const eventItemsList = eventItems.slice().sort(function (a, b) {
  return a.startTime - b.startTime;
});
const pointsToGetTripInfo = eventItemsList.slice(0, INITIAL_POINTS_NUMBER);

render(tripMainElement, new TripInfo(pointsToGetTripInfo).getElement(), `afterbegin`);
render(tripTabsHeader, new TripTabs().getElement(), `afterend`);
render(tripControlsElement, new TripFilters().getElement(), `beforeend`);
render(tripEventsElement, new ListSort().getElement(), `beforeend`);
const tripListComponent = new TripEventsList();
render(tripEventsElement, tripListComponent.getElement(), `beforeend`);

tripMainElement.querySelector(`.trip-main__event-add-btn`).addEventListener(`click`, () => {
  render(tripListComponent.getElement(), new AddPointForm().getElement(), `afterbegin`);
});

for (let i = 1; i < INITIAL_POINTS_NUMBER; i++) {
  renderPoint(tripListComponent.getElement(), eventItemsList[i]);
}
