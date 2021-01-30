import AbstractView from "./abstract.js";
import dayjs from "dayjs";
import {durationString} from "../utils/common.js";

const createTripEventItemTemplate = (item) => {

  const {startTime, endTime, price, isFavorite, eventType, eventOffers, destination} = item;
  const placeName = destination.name;
  const startDate = dayjs(startTime).format(`MMM D`);
  const start = dayjs(startTime).format(`HH:mm`);
  const end = dayjs(endTime).format(`HH:mm`);

  const isOffersListHidden = eventOffers.length > 0 ? `` : `visually-hidden`;

  const createOffersListTemplate = (offers) => {
    const Ordered = offers.filter(function (offer) {
      return offer.isOrdered;
    });
    return Ordered.reduce(function (accumulator, currentValue) {
      return accumulator + `<li class="event__offer">
        <span class="event__offer-title">${currentValue.name}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${currentValue.price}</span>
      </li>`;
    }, ``);
  };

  return `<li class="trip-events__item">
    <div class="event">
      <time class="event__date" datetime="2019-03-18">${startDate}</time>
      <div class="event__type">
        <img class="event__type-icon" width="42" height="42" src="img/icons/${eventType.toLowerCase()}.png" alt="Event type icon">
      </div>
      <h3 class="event__title">${eventType} ${placeName}</h3>
      <div class="event__schedule">
        <p class="event__time">
          <time class="event__start-time" datetime="2019-03-18T10:30">${start}</time>
          &mdash;
          <time class="event__end-time" datetime="2019-03-18T11:00">${end}</time>
        </p>
        <p class="event__duration">${durationString(startTime, endTime)}</p>
      </div>
      <p class="event__price">
        &euro;&nbsp;<span class="event__price-value">${price}</span>
      </p>
      <h4 class="visually-hidden">Offers:</h4>
      <ul class="event__selected-offers ${isOffersListHidden}">
        ${createOffersListTemplate(eventOffers)}
      </ul>
      <button class="event__favorite-btn ${isFavorite ? `event__favorite-btn--active` : ``}" type="button">
        <span class="visually-hidden">Add to favorite</span>
        <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
          <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
        </svg>
      </button>
      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>
    </div>
  </li>`;
};

export default class TripEventItem extends AbstractView {
  constructor(point) {
    super();
    this._point = point;

    this._editClickHandler = this._editClickHandler.bind(this);
    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);
  }

  getTemplate() {
    return createTripEventItemTemplate(this._point);
  }

  _editClickHandler(evt) {
    evt.preventDefault();
    this._callback.editClick();
  }

  _favoriteClickHandler(evt) {
    evt.preventDefault();
    this._callback.favoriteClick();
  }

  setEditClickHandler(callback) {
    this._callback.editClick = callback;
    this.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, this._editClickHandler);
  }

  setFavoriteClickHandler(callback2) {
    this._callback.favoriteClick = callback2;
    this.getElement().querySelector(`.event__favorite-btn`).addEventListener(`click`, this._favoriteClickHandler);
  }
}
