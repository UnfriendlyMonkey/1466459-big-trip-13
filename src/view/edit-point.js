import Smart from "./smart.js";
import dayjs from "dayjs";
import flatpickr from "flatpickr";

import "../../node_modules/flatpickr/dist/flatpickr.min.css";

const DEFAULT_STATE = {
  // id: null,
  eventType: `Transport`,
  eventOffers: [],
  destination: {
    name: `Amsterdam`,
    description: ``,
    photos: []
  },
  startTime: dayjs(),
  endTime: dayjs(),
  price: 0,
  isFavorite: false
};

const createEditPointFormTemplate = (item, options, destinations) => {

  const {startTime, endTime, price, eventType, eventOffers, destination} = item;
  const placeName = destination.name;
  const start = dayjs(startTime).format(`DD/MM/YY HH:mm`);
  const end = dayjs(endTime).format(`DD/MM/YY HH:mm`);

  const destinationsNames = destinations.map((dest) => dest.name);
  const availableOffers = options.filter((offer) => offer.type === eventType.toLowerCase())[0].offers;

  const isOffersSectionHidden = availableOffers.length > 0 ? `` : `visually-hidden`;

  const isSubmitDisabled = dayjs(startTime).isAfter(dayjs(endTime));

  const isOfferOrdered = (offerName) => {
    const orderedOffers = eventOffers.map((offer) => offer.name);
    return orderedOffers.indexOf(offerName) !== -1;
  };

  const createDestinationsList = (dest) => {
    return dest.reduce((accumulator, currentValue) => {
      return accumulator + `<option value="${currentValue}"></option>`;
    }, ``);
  };

  const createOffersListTemplate = () => {
    return availableOffers.reduce(function (accumulator, currentValue, index) {
      return accumulator + `<div class="event__offer-selector">
        <input class="event__offer-checkbox  visually-hidden" id="event-offer-${index}" type="checkbox" name="event-offer-${index}" ${isOfferOrdered(currentValue.title) ? `checked` : ``}>
        <label class="event__offer-label" for="event-offer-${index}">
          <span class="event__offer-title">${currentValue.title}</span>
          &plus;&euro;&nbsp;
          <span class="event__offer-price">${currentValue.price}</span>
        </label>
      </div>`;
    }, ``);
  };

  const renderPhoto = (photos) => {
    return photos.reduce((accumulator, currentValue) => {
      return accumulator + `<img class="event__photo" src="${currentValue.src}" alt="${currentValue.description}">`;
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
          <input class="event__input  event__input--destination" id="event-destination-1" name="event-destination" value=${placeName} list="destination-list-1" required placeholder="Destination">
          <datalist id="destination-list-1">
            ${createDestinationsList(destinationsNames)}
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
          <input class="event__input  event__input--price" id="event-price-1" type="number" name="event-price" value=${price}>
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit" ${isSubmitDisabled ? `disabled` : ``}>Save</button>
        <button class="event__reset-btn" type="reset">Delete</button>
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </header>
      <section class="event__details">
        <section class="event__section  event__section--offers ${isOffersSectionHidden}">
          <h3 class="event__section-title  event__section-title--offers">Offers</h3>

          <div class="event__available-offers">
            ${createOffersListTemplate()}
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
  constructor(pointsModel, point = DEFAULT_STATE) {
    super();
    this._data = EditPointForm.parsePointToData(point);
    this._startDatepicker = null;
    this._endDatepicker = null;

    this._allOptionsList = pointsModel.getOffers();
    this._allDestinationsList = pointsModel.getDestinations();

    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._formCloseHandler = this._formCloseHandler.bind(this);
    this._formDeleteClickHandler = this._formDeleteClickHandler.bind(this);

    this._offerSelectHandler = this._offerSelectHandler.bind(this);
    this._priceInputHandler = this._priceInputHandler.bind(this);
    this._destinationInputHandler = this._destinationInputHandler.bind(this);
    this._eventTypeChangeHandler = this._eventTypeChangeHandler.bind(this);

    this._startDateChangeHandler = this._startDateChangeHandler.bind(this);
    this._endDateChangeHandler = this._endDateChangeHandler.bind(this);

    this._setInnerHandlers();
    this._setStartDatepicker();
    this._setEndDatepicker();
  }

  reset(point) {
    this.updateData(
        EditPointForm.parsePointToData(point)
    );
  }

  getTemplate() {
    return createEditPointFormTemplate(this._data, this._allOptionsList, this._allDestinationsList);
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this._setStartDatepicker();
    this._setEndDatepicker();
    this.setFormSubmitHandler(this._callback.formSubmit);
    this.setFormCloseHandler(this._callback.formClose);
    this.setDeleteClickHandler(this._callback.deleteClick);
  }

  _setStartDatepicker() {
    if (this._startDatepicker) {
      this._startDatepicker.destroy();
      this._startDatepicker = null;
    }

    this._startDatepicker = flatpickr(
        this.getElement().querySelector(`#event-start-time-1`),
        {
          enableTime: true,
          dateFormat: `j/m/y H:i`,
          onClose: this._startDateChangeHandler
        }
    );
  }

  _setEndDatepicker() {
    if (this._endDatepicker) {
      this._endDatepicker.destroy();
      this._endDatepicker = null;
    }

    this._endDatepicker = flatpickr(
        this.getElement().querySelector(`#event-end-time-1`),
        {
          enableTime: true,
          dateFormat: `j/m/y H:i`,
          onClose: this._endDateChangeHandler
        }
    );
  }

  _setInnerHandlers() {
    this.getElement()
        .querySelector(`.event__available-offers`)
        .addEventListener(`change`, this._offerSelectHandler);
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
      eventType: newType.charAt(0).toUpperCase() + newType.slice(1),
      eventOffers: []
    });
  }

  _offerSelectHandler(evt) {
    evt.preventDefault();
    if (!evt.target === `.event__offer-checkbox`) {
      return;
    }
    const label = document.querySelector(`[for="${evt.target.id}"]`);
    const titleSpan = label.querySelector(`.event__offer-title`);
    const title = titleSpan.textContent;
    const orderedOffersNames = this._data.eventOffers.map((offer) => offer.name);
    const isOrdered = orderedOffersNames.indexOf(title) !== -1;
    if (isOrdered) {
      const index = orderedOffersNames.indexOf(title);
      this._data.eventOffers.splice(index, 1);
    } else {
      const eventType = this._data.eventType;
      const availableOffers = this._allOptionsList.filter((offer) => offer.type === eventType.toLowerCase())[0].offers;
      const offerToAdd = availableOffers.filter((offer) => offer.title === title)[0];
      this._data.eventOffers.push({
        name: offerToAdd.title,
        price: offerToAdd.price,
        isOrdered: true
      });
    }

    this.updateData({
      eventOffers: this._data.eventOffers
    });
  }

  _startDateChangeHandler([userDate]) {
    this.updateData({
      startTime: userDate
    });
  }

  _endDateChangeHandler([userDate]) {
    this.updateData({
      endTime: userDate
    });
  }

  _priceInputHandler(evt) {
    evt.preventDefault();
    this.updateData({
      price: parseInt(evt.target.value, 10)
    }, true);
  }

  _destinationInputHandler(evt) {
    const newDestination = evt.target.value;
    const destinationsNames = this._allDestinationsList.map((dest) => dest.name);
    const newDestinationObject = this._allDestinationsList.filter((dest) => dest.name === newDestination)[0];
    if (destinationsNames.indexOf(newDestination) === -1) {
      return;
    }
    Object.assign(
        {},
        this._data.destination,
        this._data.destination.name = newDestination,
        this._data.destination.description = newDestinationObject.description,
        this._data.destination.photos = newDestinationObject.pictures);
    this.updateData({
      destination: this._data.destination
    });
  }

  _formSubmitHandler(evt) {
    evt.preventDefault();
    this._callback.formSubmit(EditPointForm.parseDataToPoint(this._data));
  }

  _formCloseHandler(evt) {
    evt.preventDefault();
    this._callback.formClose();
  }

  _formDeleteClickHandler(evt) {
    evt.preventDefault();
    this._callback.deleteClick(EditPointForm.parseDataToPoint(this._data));
  }

  setFormSubmitHandler(callback) {
    this._callback.formSubmit = callback;
    this.getElement().querySelector(`.event--edit`).addEventListener(`submit`, this._formSubmitHandler);
  }

  setFormCloseHandler(anotherCallback) {
    this._callback.formClose = anotherCallback;
    this.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, this._formCloseHandler);
  }

  setDeleteClickHandler(callback) {
    this._callback.deleteClick = callback;
    this.getElement().querySelector(`.event__reset-btn`).addEventListener(`click`, this._formDeleteClickHandler);
  }

  static parsePointToData(point) {
    return JSON.parse(JSON.stringify(point));
  }

  static parseDataToPoint(data) {
    const newData = JSON.parse(JSON.stringify(data));
    newData.startTime = dayjs(newData.startTime).toDate();
    newData.endTime = dayjs(newData.endTime).toDate();
    return newData;
  }
}
