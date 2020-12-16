import Smart from "./smart.js";
import dayjs from "dayjs";
import {DESTINATIONS, EVENT_TYPES} from "../mock/event-item.js";

const createEditPointFormTemplate = (item) => {

  const {startTime, endTime, price, eventType, eventOffers, destination} = item;
  const placeName = destination.name;
  const start = dayjs(startTime).format(`DD/MM/YY HH:mm`);
  const end = dayjs(endTime).format(`DD/MM/YY HH:mm`);

  const isOffersSectionHidden = eventOffers.length > 0 ? `` : `visually-hidden`;

  const createOffersListTemplate = (offers) => {
    return offers.reduce(function (accumulator, currentValue, index) {
      return accumulator + `<div class="event__offer-selector">
        <input class="event__offer-checkbox  visually-hidden" id="edit-offer-${index}" type="checkbox" name="edit-offer-${index}" ${currentValue.isOrdered ? `checked` : ``}>
        <label class="event__offer-label" for="edit-offer-${index}">
          <span class="event__offer-title">${currentValue.name}</span>
          &plus;&euro;&nbsp;
          <span class="event__offer-price">${currentValue.price}</span>
        </label>
      </div>`;
    }, ``);
  };

  const renderPhoto = (photos) => {
    return photos.reduce((accumulator, currentValue) => {
      return accumulator + `<img class="event__photo" src="${currentValue}" alt="Event photo">`;
    }, ``);
  };

  const getPhotosTemplate = () => {
    let fragment = ``;
    if (destination.photos) {
      fragment = `<div class="event__photos-container">
        <div class="event__photos-tape">
          ${renderPhoto(destination.photos)}
        </div>
      </div>`;
    }
    return fragment;
  };

  return `<li class="trip-events__item">
    <form class="event event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${eventType.toLowerCase()}.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

          <div class="event__type-list">
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Event type</legend>

              <div class="event__type-item">
                <input id="event-type-taxi-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="taxi">
                <label class="event__type-label  event__type-label--taxi" for="event-type-taxi-1">Taxi</label>
              </div>

              <div class="event__type-item">
                <input id="event-type-bus-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="bus">
                <label class="event__type-label  event__type-label--bus" for="event-type-bus-1">Bus</label>
              </div>

              <div class="event__type-item">
                <input id="event-type-train-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="train">
                <label class="event__type-label  event__type-label--train" for="event-type-train-1">Train</label>
              </div>

              <div class="event__type-item">
                <input id="event-type-ship-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="ship">
                <label class="event__type-label  event__type-label--ship" for="event-type-ship-1">Ship</label>
              </div>

              <div class="event__type-item">
                <input id="event-type-transport-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="transport">
                <label class="event__type-label  event__type-label--transport" for="event-type-transport-1">Transport</label>
              </div>

              <div class="event__type-item">
                <input id="event-type-drive-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="drive">
                <label class="event__type-label  event__type-label--drive" for="event-type-drive-1">Drive</label>
              </div>

              <div class="event__type-item">
                <input id="event-type-flight-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="flight" checked>
                <label class="event__type-label  event__type-label--flight" for="event-type-flight-1">Flight</label>
              </div>

              <div class="event__type-item">
                <input id="event-type-check-in-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="check-in">
                <label class="event__type-label  event__type-label--check-in" for="event-type-check-in-1">Check-in</label>
              </div>

              <div class="event__type-item">
                <input id="event-type-sightseeing-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="sightseeing">
                <label class="event__type-label  event__type-label--sightseeing" for="event-type-sightseeing-1">Sightseeing</label>
              </div>

              <div class="event__type-item">
                <input id="event-type-restaurant-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="restaurant">
                <label class="event__type-label  event__type-label--restaurant" for="event-type-restaurant-1">Restaurant</label>
              </div>
            </fieldset>
          </div>
        </div>

        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-1">
            ${eventType}
          </label>
          <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value=${placeName} list="destination-list-1">
          <datalist id="destination-list-1">
            <option value="Amsterdam"></option>
            <option value="Geneva"></option>
            <option value="Chamonix"></option>
          </datalist>
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-1">From</label>
          <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${start}">
          &mdash;
          <label class="visually-hidden" for="event-end-time-1">To</label>
          <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${end}">
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value=${price}>
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
        <button class="event__reset-btn" type="reset">Delete</button>
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </header>
      <section class="event__details">
        <section class="event__section  event__section--offers ${isOffersSectionHidden}">
          <h3 class="event__section-title  event__section-title--offers">Offers</h3>

          <div class="event__available-offers">
            ${createOffersListTemplate(eventOffers)}
            </div>
          </div>
        </section>

        <section class="event__section  event__section--destination">
          <h3 class="event__section-title  event__section-title--destination">Destination</h3>
          <p class="event__destination-description">${destination.description}</p>
          ${getPhotosTemplate()}
        </section>
      </section>
    </form>
  </li>`;
};

export default class EditPointForm extends Smart {
  constructor(point) {
    super();
    // this._data = point;
    this._data = EditPointForm.parsePointToData(point);

    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._formCloseHandler = this._formCloseHandler.bind(this);

    this._offerOrderedToggleHandler = this._offerOrderedToggleHandler.bind(this);
    this._priceInputHandler = this._priceInputHandler.bind(this);
    this._destinationInputHandler = this._destinationInputHandler.bind(this);
    this._eventTypeChangeHandler = this._eventTypeChangeHandler.bind(this);

    this._setInnerHandlers();
  }

  reset(point) {
    this.updateData(
        EditPointForm.parsePointToData(point)
    );
  }

  getTemplate() {
    return createEditPointFormTemplate(this._data);
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this.setFormSubmitHandler(this._callback.formSubmit);
    this.setFormCloseHandler(this._callback.formClose);
  }

  _setInnerHandlers() {
    this.getElement()
        .querySelector(`.event__available-offers`)
        .addEventListener(`click`, this._offerOrderedToggleHandler);
    this.getElement()
        .querySelector(`.event__input--price`)
        .addEventListener(`input`, this._priceInputHandler);
    this.getElement()
        .querySelector(`.event__input--destination`)
        .addEventListener(`change`, this._destinationInputHandler);
    this.getElement()
        .querySelector(`.event__type-group`)
        .addEventListener(`change`, this._eventTypeChangeHandler);
  }

  _eventTypeChangeHandler(evt) {
    evt.preventDefault();
    const newType = evt.target.value;
    this.updateData({
      eventType: EVENT_TYPES[newType].name,
      eventOffers: EVENT_TYPES[newType].offers
    });
  }

  _offerOrderedToggleHandler(evt) {
    evt.preventDefault();
    if (!evt.target.closest(`.event__offer-label`)) {
      return;
    }
    const label = evt.target.closest(`.event__offer-label`);
    const index = Number.parseInt(label.htmlFor.slice(11), 10);
    const orderToChange = this._data.eventOffers[index];
    Object.assign({}, orderToChange, orderToChange.isOrdered = !orderToChange.isOrdered);
    this.updateData(
        this._data.eventOffers
    );
  }

  _priceInputHandler(evt) {
    evt.preventDefault();
    this.updateData({
      price: evt.target.value
    }, true);
  }

  _destinationInputHandler(evt) {
    const newDestination = evt.target.value;
    Object.assign(
        {},
        this._data.destination,
        this._data.destination.name = newDestination,
        this._data.destination.description = DESTINATIONS[newDestination][0],
        this._data.destination.photos = DESTINATIONS[newDestination][1]);
    this.updateData(
        this._data.destination
    );
  }

  _formSubmitHandler(evt) {
    evt.preventDefault();
    this._callback.formSubmit(EditPointForm.parseDataToPoint(this._data));
  }

  _formCloseHandler(evt) {
    evt.preventDefault();
    this._callback.formClose();
  }

  setFormSubmitHandler(callback) {
    this._callback.formSubmit = callback;
    this.getElement().querySelector(`.event--edit`).addEventListener(`submit`, this._formSubmitHandler);
  }

  setFormCloseHandler(anotherCallback) {
    this._callback.formClose = anotherCallback;
    this.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, this._formCloseHandler);
  }

  static parsePointToData(point) {
    return Object.assign({}, point);
  }

  static parseDataToPoint(data) {
    return Object.assign({}, data);
  }
}
