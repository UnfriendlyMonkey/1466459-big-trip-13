import {render} from "../utils/render.js";
import {updateItem} from "../utils/common.js";
import {sortByDate, sortByDuration, sortByPrice} from "../utils/list.js";
import {SortType} from "../utils/const.js";

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
    this._listSort = new ListSort();

    this._eventAddButtonHandler = this._eventAddButtonHandler.bind(this);
    this._pointChangeHandler = this._pointChangeHandler.bind(this);
    this._modeChangeHandler = this._modeChangeHandler.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
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

  _getPoints() {
    return this._pointsModel.getPoints();
  }

  _renderEmptyList() {
    render(this._listContainer, this._emptyListMessage, `beforeend`);
  }

  _sortList(sortType) {
    switch (sortType) {
      case SortType.PRICE:
        this._tripPoints.sort(sortByPrice);
        break;
      case SortType.DURATION:
        this._tripPoints.sort(sortByDuration);
        break;
      default:
        this._tripPoints.sort(sortByDate);
    }
    this._currentSortType = sortType;
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._sortList(sortType);
    this._clearList();
    this._renderPoints();
  }

  _renderListSort() {
    render(this._listContainer, this._listSort, `beforeend`);
    this._listSort.setSortTypeChangeHandler(this._handleSortTypeChange);
  }

  _renderAddPointForm() {
    render(this._tripListComponent, this._editPointForm, `afterbegin`);
  }

  _renderPoint(point) {
    const pointPresenter = new PointPresenter(this._tripListComponent, this._pointChangeHandler, this._modeChangeHandler);
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

  _clearList() {
    Object.values(this._pointPresenter).forEach((presenter) => presenter.destroy());
    this._pointPresenter = {};
  }

  _eventAddButtonHandler(evt) {
    evt.preventDefault();
    this._renderAddPointForm();
  }

  _pointChangeHandler(changedPoint) {
    this._tripPoints = updateItem(this._tripPoints, changedPoint);
    this._pointPresenter[changedPoint.id].init(changedPoint);
  }

  _modeChangeHandler() {
    Object.values(this._pointPresenter).forEach((presenter) => presenter.resetView());
  }
}
