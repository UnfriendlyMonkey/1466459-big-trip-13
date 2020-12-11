import TripEventItem from "../view/trip-event-item.js";
import EditPoint from "../view/edit-point.js";

import {render, replace} from "../utils/render.js";

export default class PointPresenter {
  constructor(listComponent) {
    this._listComponent = listComponent;

    this._pointComponent = null;
    this._pointEditComponent = null;

    this._showEditForm = this._showEditForm.bind(this);
    this._hideEditForm = this._hideEditForm.bind(this);
    this._onEscHideEditForm = this._onEscHideEditForm.bind(this);
  }

  init(point) {
    this._point = point;

    this._pointComponent = new TripEventItem(point);
    this._pointEditComponent = new EditPoint(point);

    this._pointComponent.setEditClickHandler(() => this._showEditForm());

    this._pointEditComponent.setFormSubmitHandler(() => this._hideEditForm());
    this._pointEditComponent.setFormCloseHandler(() => this._hideEditForm());

    render(this._listComponent, this._pointComponent, `beforeend`);
  }

  _onEscHideEditForm(evt) {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      this._hideEditForm();
    }
  }

  _showEditForm() {
    replace(this._pointEditComponent, this._pointComponent);
    document.addEventListener(`keydown`, this._onEscHideEditForm);
  }

  _hideEditForm() {
    replace(this._pointComponent, this._pointEditComponent);
    document.removeEventListener(`keydown`, this._onEscHideEditForm);
  }
}
