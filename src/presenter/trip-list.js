import {remove, render, replace} from "../utils/render.js";
import {sortByDate, sortByDuration, sortByPrice} from "../utils/list.js";
import {SortType, UpdateType, UserAction, FilterType} from "../utils/const.js";
import {filter} from "../utils/filter.js";

import ListSort from "../view/list-sort.js";
import EmptyListMessage from "../view/empty-list.js";
import LoadingMessage from "../view/loading.js";
import TripEventsList from "../view/trip-event-list.js";

import PointPresenter, {State as PointPresenterViewState} from "../presenter/point.js";
import NewPointPresenter from "../presenter/new-point.js";
import TripInfo from "../view/trip-info.js";

export default class TripList {
  constructor(listContainer, pointsModel, filterModel, api) {
    this._pointsModel = pointsModel;
    this._filterModel = filterModel;
    this._listContainer = listContainer;
    this._pointPresenter = {};
    this._currentSortType = SortType.DAY;
    this._isLoading = true;
    this._api = api;

    this._tripListComponent = new TripEventsList();
    this._emptyListMessage = new EmptyListMessage();
    this._loadingMessage = new LoadingMessage();
    this._listSort = null;

    this._modeChangeHandler = this._modeChangeHandler.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);

    this._newPointPresenter = new NewPointPresenter(this._tripListComponent, this._handleViewAction);

    this._pointsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
  }

  init() {

    if (this._isLoading) {
      this._renderLoading();
      return;
    }
    if (this._pointsModel.getPoints().length < 1 || this._getPoints().length < 1) {
      this._renderEmptyList();
      return;
    }

    this._renderListSort();
    this._renderList();
  }

  clear() {
    this._clearTripEvents({resetSortType: true});

    remove(this._tripListComponent);
  }

  destroy() {
    this.clear();

    this._pointsModel.removeObserver(this._handleModelEvent);
    this._filterModel.removeObserver(this._handleModelEvent);
  }

  createPoint() {
    this._currentSortType = SortType.DAY;
    this._filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this._newPointPresenter.init(this._pointsModel);
  }

  _getPoints() {
    const filterType = this._filterModel.getFilter();
    const points = this._pointsModel.getPoints();
    const filteredPoints = filter[filterType](points);

    switch (this._currentSortType) {
      case SortType.PRICE:
        return filteredPoints.sort(sortByPrice);
      case SortType.DURATION:
        return filteredPoints.sort(sortByDuration);
      default:
        return filteredPoints.sort(sortByDate);
    }
  }

  _renderEmptyList() {
    render(this._listContainer, this._emptyListMessage, `beforeend`);
  }

  _renderLoading() {
    render(this._listContainer, this._loadingMessage, `beforeend`);
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._currentSortType = sortType;
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

  _renderPoint(point) {
    const pointPresenter = new PointPresenter(this._tripListComponent, this._handleViewAction, this._modeChangeHandler);
    pointPresenter.init(point, this._pointsModel);
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
    this._newPointPresenter.destroy();
    Object.values(this._pointPresenter).forEach((presenter) => presenter.destroy());
    this._pointPresenter = {};
  }

  _clearTripEvents({resetSortType = false} = {}) {
    this._clearList();

    remove(this._listSort);
    remove(this._emptyListMessage);
    remove(this._loadingMessage);

    if (resetSortType) {
      this._currentSortType = SortType.DAY;
    }
  }

  _handleModelEvent(updateType, data) {
    this._updateTripInfo();
    switch (updateType) {
      case UpdateType.PATCH:
        this._pointPresenter[data.id].init(data);
        break;
      case UpdateType.MINOR:
        this._clearList();
        this._renderPoints();
        break;
      case UpdateType.MAJOR:
        this._clearTripEvents({resetSortType: true});
        this.init();
        break;
      case UpdateType.INIT:
        this._isLoading = false;
        remove(this._loadingMessage);
        this.init();
        break;
    }
  }

  _handleViewAction(actionType, updateType, update) {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this._pointPresenter[update.id].setViewState(PointPresenterViewState.SAVING);
        this._api.updatePoint(update)
        .then((response) => {
          this._pointsModel.updatePoint(updateType, response);
        })
        .catch(() => {
          this._pointPresenter[update.id].setViewState(PointPresenterViewState.ABORTING);
        });
        break;
      case UserAction.ADD_POINT:
        this._newPointPresenter.setSaving();
        this._api.addPoint(update)
        .then((response) => {
          this._pointsModel.addPoint(updateType, response);
        })
        .catch(() => {
          this._newPointPresenter.setAborting();
        });
        break;
      case UserAction.DELETE_POINT:
        this._pointPresenter[update.id].setViewState(PointPresenterViewState.DELETING);
        this._api.deletePoint(update)
        .then(() => {
          this._pointsModel.deletePoint(updateType, update);
        })
        .catch(() => {
          this._pointPresenter[update.id].setViewState(PointPresenterViewState.ABORTING);
        });
        break;
    }
  }

  _modeChangeHandler() {
    this._newPointPresenter.destroy();
    Object.values(this._pointPresenter).forEach((presenter) => presenter.resetView());
  }

  _updateTripInfo() {
    const prevTripInfoComponent = document.querySelector(`.trip-info`);
    const newTripInfoComponent = new TripInfo(this._pointsModel.getPoints().sort(sortByDate));
    replace(newTripInfoComponent, prevTripInfoComponent);
  }
}
