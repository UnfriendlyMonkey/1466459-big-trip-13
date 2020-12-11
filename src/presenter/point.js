import TripEventItem from "../view/trip-event-item.js";
import EditPoint from "../view/edit-point.js";

import {render, replace, remove} from "../utils/render.js";

export default class PointPresenter {
  constructor(listComponent, changeData) {
    this._listComponent = listComponent;
    this._changeData = changeData;

    this._pointComponent = null;
    this._pointEditComponent = null;

    this._showEditForm = this._showEditForm.bind(this);
    this._hideEditForm = this._hideEditForm.bind(this);
    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleFormClose = this._handleFormClose.bind(this);
    this._onEscHideEditForm = this._onEscHideEditForm.bind(this);
    this._handleFavouriteClick = this._handleFavouriteClick.bind(this);
  }

  init(point) {
    this._point = point;

    const prevPointComponent = this._pointComponent;
    const prevPointEditComponent = this._pointEditComponent;

    this._pointComponent = new TripEventItem(point);
    this._pointEditComponent = new EditPoint(point);

    this._pointComponent.setEditClickHandler(() => this._showEditForm());
    this._pointComponent.setFavouriteClickHandler(this._handleFavouriteClick);

    this._pointEditComponent.setFormSubmitHandler(() => this._handleFormSubmit(this._point));
    this._pointEditComponent.setFormCloseHandler(() => this._handleFormClose());

    if (prevPointComponent === null || prevPointEditComponent === null) {
      render(this._listComponent, this._pointComponent, `beforeend`);
      return;
    }

    if (this._listComponent.getElement().contains(prevPointComponent.getElement())) {
      replace(this._pointComponent, prevPointComponent);
    }
    if (this._listComponent.getElement().contains(prevPointEditComponent.getElement())) {
      replace(this._pointEditComponent, prevPointEditComponent);
    }

    remove(prevPointComponent);
    remove(prevPointEditComponent);
  }

  destroy() {
    remove(this._pointComponent);
    remove(this._pointEditComponent);
  }

  _onEscHideEditForm(evt) {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      this._hideEditForm();
    }
  }

  _handleFormSubmit(task) {
    this._changeData(task);
    this._hideEditForm();
  }

  _handleFormClose() {
    this._hideEditForm();
  }

  _showEditForm() {
    replace(this._pointEditComponent, this._pointComponent);
    document.addEventListener(`keydown`, this._onEscHideEditForm);
  }

  _hideEditForm() {
    replace(this._pointComponent, this._pointEditComponent);
    document.removeEventListener(`keydown`, this._onEscHideEditForm);
  }

  _handleFavouriteClick() {
    this._changeData(Object.assign({}, this._point, {isFavourite: !this._point.isFavourite}));
  }
}
