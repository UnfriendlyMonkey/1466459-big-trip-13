import {remove, render} from "../utils/render.js";
import {sortByDate, sortByDuration, sortByPrice} from "../utils/list.js";
import {SortType, UpdateType, UserAction} from "../utils/const.js";

import ListSort from "../view/list-sort.js";
import EmptyListMessage from "../view/empty-list.js";
import TripEventsList from "../view/trip-event-list.js";

import PointPresenter from "../presenter/point.js";
import EditPointForm from "../view/edit-point.js";

export default class TripList {
  constructor(listContainer, pointsModel) {
    this._pointsModel = pointsModel;
    this._listContainer = listContainer;
    this._pointPresenter = {};
    this._currentSortType = SortType.DAY;

    this._tripListComponent = new TripEventsList();
    this._emptyListMessage = new EmptyListMessage();
    this._editPointForm = new EditPointForm();
    this._listSort = null;

    this._eventAddButtonHandler = this._eventAddButtonHandler.bind(this);
    this._modeChangeHandler = this._modeChangeHandler.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);

    this._pointsModel.addObserver(this._handleModelEvent);
  }

  init() {
    // this._tripPoints = tripPoints.slice();
    if (this._getPoints().length < 1) {
      this._renderEmptyList();
      return;
    }

    this._renderListSort();
    this._renderList();
  }

  _getPoints() {
    switch (this._currentSortType) {
      case SortType.PRICE:
        return this._pointsModel.getPoints().sort(sortByPrice);
      case SortType.DURATION:
        return this._pointsModel.getPoints().sort(sortByDuration);
      default:
        return this._pointsModel.getPoints().sort(sortByDate);
    }
  }

  _renderEmptyList() {
    render(this._listContainer, this._emptyListMessage, `beforeend`);
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._currentSortType = sortType;
    // this._clearList();
    // this._renderPoints();
    this._clearTripEvents();
    this.init();
  }

  _renderListSort() {
    if (this._listSort !== null) {
      this._listSort = null;
    }
    this._listSort = new ListSort(this._currentSortType);
    this._listSort.setSortTypeChangeHandler(this._handleSortTypeChange);
    render(this._listContainer, this._listSort, `beforeend`);
  }

  _renderAddPointForm() {
    render(this._tripListComponent, this._editPointForm, `afterbegin`);
  }

  _renderPoint(point) {
    const pointPresenter = new PointPresenter(this._tripListComponent, this._handleViewAction, this._modeChangeHandler);
    pointPresenter.init(point);
    this._pointPresenter[point.id] = pointPresenter;
  }

  _renderPoints() {
    this._getPoints().forEach((point) => {
      this._renderPoint(point);
    });
  }

  _renderList() {
    render(this._listContainer, this._tripListComponent, `beforeend`);
    this._renderPoints();
  }

  _clearList() {
    Object.values(this._pointPresenter).forEach((presenter) => presenter.destroy());
    this._pointPresenter = {};
  }

  _clearTripEvents({resetSortType = false} = {}) {
    Object
      .values(this._pointPresenter)
      .forEach((presenter) => presenter.destroy());
    this._pointPresenter = {};

    remove(this._listSort);
    remove(this._emptyListMessage);

    if (resetSortType) {
      this._currentSortType = SortType.DAY;
    }
  }

  _eventAddButtonHandler(evt) {
    evt.preventDefault();
    this._renderAddPointForm();
  }

  _handleModelEvent(updateType, data) {
    // console.log(updateType, data);
    switch (updateType) {
      case UpdateType.PATCH:
        this._pointPresenter[data.id].init(data);
        break;
      case UpdateType.MINOR:
        this._clearList();
        this._renderPoints();
        break;
      case UpdateType.MAJOR:
        // not sure about all this
        this._clearTripEvents({resetSortType: true});
        // may be should make special _renderTripEvents instead of init
        this.init();
        break;
    }
  }

  _handleViewAction(actionType, updateType, update) {
    // console.log(actionType, updateType, update);
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this._pointsModel.updatePoint(updateType, update);
        break;
      case UserAction.ADD_POINT:
        this._pointsModel.addPoint(updateType, update);
        break;
      case UserAction.DELETE_POINT:
        this._pointsModel.deletePoint(updateType, update);
        break;
    }
  }

  _modeChangeHandler() {
    Object.values(this._pointPresenter).forEach((presenter) => presenter.resetView());
  }
}
