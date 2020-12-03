import TripInfo from "./view/trip-info.js";
import TripTabs from "./view/trip-tabs.js";
import TripFilters from "./view/trip-filters.js";
import ListSort from "./view/list-sort.js";
import TripEventsList from "./view/trip-event-list.js";
import TripEventItem from "./view/trip-event-item.js";
import AddPointForm from "./view/add-point.js";
import EditPoint from "./view/edit-point.js";
import EmptyListMessage from "./view/empty-list.js";

import {generateEventItem} from "./mock/event-item.js";

import {render, replace} from "./utils/render.js";

const INITIAL_POINTS_NUMBER = 5;

const renderPoint = (tripListElement, point) => {
  const pointComponent = new TripEventItem(point);
  const pointEditComponent = new EditPoint(point);

  const onEscHideEditForm = (evt) => {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      hideEditForm();
    }
  };

  const showEditForm = () => {
    replace(pointEditComponent, pointComponent);
    document.addEventListener(`keydown`, onEscHideEditForm);
  };
  const hideEditForm = () => {
    replace(pointComponent, pointEditComponent);
    document.removeEventListener(`keydown`, onEscHideEditForm);
  };

  pointComponent.setEditClickHandler(() => showEditForm());

  pointEditComponent.setFormSubmitHandler(() => hideEditForm());
  pointEditComponent.setFormCloseHandler(() => hideEditForm());

  render(tripListElement, pointComponent, `beforeend`);
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

render(tripMainElement, new TripInfo(pointsToGetTripInfo), `afterbegin`);
render(tripTabsHeader, new TripTabs(), `afterend`);
render(tripControlsElement, new TripFilters(), `beforeend`);
render(tripEventsElement, new ListSort(), `beforeend`);
const tripListComponent = new TripEventsList();
render(tripEventsElement, tripListComponent, `beforeend`);

tripMainElement.querySelector(`.trip-main__event-add-btn`).addEventListener(`click`, () => {
  render(tripListComponent, new AddPointForm(), `afterbegin`);
});

if (pointsToGetTripInfo.length < 1) {
  render(tripListComponent, new EmptyListMessage(), `beforeend`);
} else {
  pointsToGetTripInfo.forEach((point) => {
    renderPoint(tripListComponent, point);
  });
}
