import EditPointForm from "../view/edit-point.js";
import {remove, render} from "../utils/render.js";
import {UserAction, UpdateType} from "../utils/const.js";

export default class NewPoint {
  constructor(tripListContainer, changeData) {
    this._tripListContainer = tripListContainer;
    this._changeData = changeData;

    this._pointEditComponent = null;

    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleDeleteClick = this._handleDeleteClick.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
    this.destroy = this.destroy.bind(this);
  }

  init(pointsModel) {
    if (this._pointEditComponent !== null) {
      return;
    }

    this._pointEditComponent = new EditPointForm(pointsModel);
    this._pointEditComponent.setFormSubmitHandler(this._handleFormSubmit);
    this._pointEditComponent.setDeleteClickHandler(this._handleDeleteClick);
    this._pointEditComponent.setFormCloseHandler(this._handleDeleteClick);

    render(this._tripListContainer, this._pointEditComponent, `afterbegin`);

    document.addEventListener(`keydown`, this._escKeyDownHandler);
  }

  destroy() {
    if (this._pointEditComponent === null) {
      return;
    }

    remove(this._pointEditComponent);
    this._pointEditComponent = null;

    document.removeEventListener(`keydown`, this._escKeyDownHandler);
  }

  setSaving() {
    this._pointEditComponent.updateData({
      isDisabled: true,
      isSaving: true
    });
  }

  _handleFormSubmit(point) {
    this._changeData(
        UserAction.ADD_POINT,
        UpdateType.MAJOR,
        point
    );
    // this.destroy();
  }

  _handleDeleteClick() {
    this.destroy();
  }

  _escKeyDownHandler(evt) {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();
      this.destroy();
    }
  }
}
