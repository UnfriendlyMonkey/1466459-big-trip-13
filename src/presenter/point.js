import TripEventItem from "../view/trip-event-item.js";
import EditPoint from "../view/edit-point.js";

import {render, replace, remove} from "../utils/render.js";
import {UserAction, UpdateType} from "../utils/const.js";
import {isOnline} from "../utils/common.js";
import {toast} from "../utils/toast/toast.js";

const Mode = {
  DEFAULT: `DEFAULT`,
  EDITING: `EDITING`
};

export const State = {
  SAVING: `SAVING`,
  DELETING: `DELETING`,
  ABORTING: `ABORTING`
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
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
    this._handleDeleteClick = this._handleDeleteClick.bind(this);
    this._handleEditClick = this._handleEditClick.bind(this);
  }

  init(point, pointsModel) {
    this._point = point;

    const prevPointComponent = this._pointComponent;
    const prevPointEditComponent = this._pointEditComponent;

    this._pointComponent = new TripEventItem(point);
    this._pointEditComponent = new EditPoint(pointsModel, point);

    this._pointComponent.setEditClickHandler(this._handleEditClick);
    this._pointComponent.setFavoriteClickHandler(this._handleFavoriteClick);

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
      replace(this._pointComponent, prevPointEditComponent);
      this._mode = Mode.DEFAULT;
    }

    remove(prevPointComponent);
    remove(prevPointEditComponent);
  }

  resetView() {
    if (this._mode !== Mode.DEFAULT) {
      this._hideEditForm();
    }
  }

  setViewState(state) {
    const resetFormState = () => {
      this._pointEditComponent.updateData({
        isDisabled: false,
        isSaving: false,
        isDeleting: false
      });
    };

    switch (state) {
      case State.SAVING:
        this._pointEditComponent.updateData({
          isDisabled: true,
          isSaving: true
        });
        break;
      case State.DELETING:
        this._pointEditComponent.updateData({
          isDisabled: true,
          isDeleting: true
        });
        break;
      case State.ABORTING:
        this._pointComponent.shake(resetFormState);
        this._pointEditComponent.shake(resetFormState);
        break;
    }
  }

  destroy() {
    remove(this._pointComponent);
    remove(this._pointEditComponent);
  }

  _handleEditClick() {
    if (!isOnline()) {
      toast(`You can't edit point offline`);
      return;
    }

    this._showEditForm();
  }

  _onEscHideEditForm(evt) {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      this._pointEditComponent.reset(this._point);
      this._hideEditForm();
    }
  }

  _handleFormSubmit(point) {
    if (!isOnline()) {
      toast(`You can't save point offline`);
      return;
    }

    this._changeData(
        UserAction.UPDATE_POINT,
        UpdateType.MINOR,
        point
    );
  }

  _handleDeleteClick(point) {
    if (!isOnline()) {
      toast(`You can't delete point offline`);
      return;
    }

    this._changeData(
        UserAction.DELETE_POINT,
        UpdateType.MAJOR,
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

  _handleFavoriteClick() {
    this._changeData(
        UserAction.UPDATE_POINT,
        UpdateType.MINOR,
        Object.assign({}, this._point, {isFavorite: !this._point.isFavorite})
    );
  }
}
