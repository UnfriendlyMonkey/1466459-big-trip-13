import {render} from "../utils/render.js";
import {updateItem} from "../utils/common.js";

import ListSort from "../view/list-sort.js";
import EmptyListMessage from "../view/empty-list.js";
import AddPointForm from "../view/add-point.js";
import TripEventsList from "../view/trip-event-list.js";

import PointPresenter from "../presenter/point.js";

export default class TripList {
  constructor(listContainer) {
    this._listContainer = listContainer;
    this._pointPresenter = {};

    this._tripListComponent = new TripEventsList();
    this._emptyListMessage = new EmptyListMessage();
    this._addPointForm = new AddPointForm();
    this._listSort = new ListSort();

    this._eventAddButtonHandler = this._eventAddButtonHandler.bind(this);
    this._pointChangeHandler = this._pointChangeHandler.bind(this);
  }

  init(tripPoints) {
    this._tripPoints = tripPoints.slice();
    if (this._tripPoints.length < 1) {
      this._renderEmptyList();
      return;
    }

    this._renderListSort();
    this._renderList();
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

  _renderPoint(point) {
    const pointPresenter = new PointPresenter(this._tripListComponent, this._pointChangeHandler);
    pointPresenter.init(point);
    this._pointPresenter[point.id] = pointPresenter;
  }

  _renderPoints() {
    this._tripPoints.forEach((point) => {
      this._renderPoint(point);
    });
  }

  _renderList() {
    render(this._listContainer, this._tripListComponent, `beforeend`);
    this._renderPoints();
  }

  _eventAddButtonHandler(evt) {
    evt.preventDefault();
    this._renderAddPointForm();
  }

  _pointChangeHandler(changedPoint) {
    this._tripPoints = updateItem(this._tripPoints, changedPoint);
    this._pointPresenter[changedPoint.id].init(changedPoint);
  }
}
