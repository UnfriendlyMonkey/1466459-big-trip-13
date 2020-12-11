import {render, replace} from "../utils/render.js";
import TripEventItem from "../view/trip-event-item.js";
import EditPoint from "../view/edit-point.js";
import ListSort from "../view/list-sort.js";
import EmptyListMessage from "../view/empty-list.js";
import AddPointForm from "../view/add-point.js";
import TripEventsList from "../view/trip-event-list.js";


export default class TripList {
  constructor(listContainer) {
    this._listContainer = listContainer;

    this._tripListComponent = new TripEventsList();
    this._emptyListMessage = new EmptyListMessage();
    this._addPointForm = new AddPointForm();
    this._listSort = new ListSort();

    this._eventAddButtonHandler = this._eventAddButtonHandler.bind(this);
  }

  init(tripPoints) {
    this._tripPoints = tripPoints.slice();
    render(this._listContainer, this._tripListComponent, `beforeend`);
    this._renderList();
  }

  _renderPoint(tripListElement, point) {
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
  }

  _renderEmptyList() {
    render(this._listContainer, this._emptyListMessage, `beforeend`);
  }

  _renderListSort() {
    render(this._listContainer, this._listSort, `beforeend`);
  }

  _renderAddPointForm() {
    render(this._tripListComponent, this._addPointForm, `afterbegin`);
  }

  _renderPoints() {
    this._tripPoints.forEach((point) => {
      this._renderPoint(this._tripListComponent, point);
    });
  }

  _renderList() {
    if (this._tripPoints.length < 1) {
      this._renderEmptyList();
      return;
    }

    this._renderListSort();
    this._renderPoints();
  }

  _eventAddButtonHandler(evt) {
    evt.preventDefault();
    // render(this._tripListComponent, this._addPointForm, `afterbegin`);
    this._renderAddPointForm();
  }
}
