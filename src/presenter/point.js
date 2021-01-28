import TripEventItem from "../view/trip-event-item.js";
import EditPoint from "../view/edit-point.js";

import {render, replace, remove} from "../utils/render.js";
import {UserAction, UpdateType} from "../utils/const.js";

const Mode = {
  DEFAULT: `DEFAULT`,
  EDITING: `EDITING`
};

export default class PointPresenter {
  constructor(listComponent, changeData, changeMode) {
    this._listComponent = listComponent;
    this._changeData = changeData;
    this._changeMode = changeMode;

    this._pointComponent = null;
    this._pointEditComponent = null;
    this._mode = Mode.DEFAULT;

    this._showEditForm = this._showEditForm.bind(this);
    this._hideEditForm = this._hideEditForm.bind(this);
    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleFormClose = this._handleFormClose.bind(this);
    this._onEscHideEditForm = this._onEscHideEditForm.bind(this);
    this._handleFavouriteClick = this._handleFavouriteClick.bind(this);
    this._handleDeleteClick = this._handleDeleteClick.bind(this);
  }

  init(point, pointsModel) {
    this._point = point;

    const prevPointComponent = this._pointComponent;
    const prevPointEditComponent = this._pointEditComponent;

    this._pointComponent = new TripEventItem(point);
    this._pointEditComponent = new EditPoint(pointsModel, point);

    this._pointComponent.setEditClickHandler(() => this._showEditForm());
    this._pointComponent.setFavouriteClickHandler(this._handleFavouriteClick);

    this._pointEditComponent.setFormSubmitHandler(this._handleFormSubmit);
    this._pointEditComponent.setFormCloseHandler(() => this._handleFormClose());
    this._pointEditComponent.setDeleteClickHandler(() => this._handleDeleteClick(this._point));

    if (prevPointComponent === null || prevPointEditComponent === null) {
      render(this._listComponent, this._pointComponent, `beforeend`);
      return;
    }

    if (this._mode === Mode.DEFAULT) {
      replace(this._pointComponent, prevPointComponent);
    }
    if (this._mode === Mode.EDITING) {
      replace(this._pointEditComponent, prevPointEditComponent);
    }

    remove(prevPointComponent);
    remove(prevPointEditComponent);
  }

  resetView() {
    if (this._mode !== Mode.DEFAULT) {
      this._hideEditForm();
    }
  }

  destroy() {
    remove(this._pointComponent);
    remove(this._pointEditComponent);
  }

  _onEscHideEditForm(evt) {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      this._pointEditComponent.reset(this._point);
      this._hideEditForm();
    }
  }

  _handleFormSubmit(point) {
    this._changeData(
        UserAction.UPDATE_POINT,
        UpdateType.MINOR,
        point
    );
    this._hideEditForm();
  }

  _handleDeleteClick(point) {
    this._changeData(
        UserAction.DELETE_POINT,
        UpdateType.MINOR,
        point
    );
  }

  _handleFormClose() {
    this._pointEditComponent.reset(this._point);
    this._hideEditForm();
  }

  _showEditForm() {
    replace(this._pointEditComponent, this._pointComponent);
    document.addEventListener(`keydown`, this._onEscHideEditForm);
    this._changeMode();
    this._mode = Mode.EDITING;
  }

  _hideEditForm() {
    replace(this._pointComponent, this._pointEditComponent);
    document.removeEventListener(`keydown`, this._onEscHideEditForm);
    this._mode = Mode.DEFAULT;
  }

  _handleFavouriteClick() {
    this._changeData(
        UserAction.UPDATE_POINT,
        UpdateType.MINOR,
        Object.assign({}, this._point, {isFavourite: !this._point.isFavourite})
    );
  }
}
