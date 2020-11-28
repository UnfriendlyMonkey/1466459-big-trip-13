import dayjs from "dayjs";
import {durationString} from "../util.js";

export const createTripEventItemTemplate = (item) => {

  const {startTime, endTime, price, isFavourite, eventType, eventOffers, destination} = item;
  const placeName = destination.name;
  const startDate = dayjs(startTime).format(`MMM D`);
  const start = dayjs(startTime).format(`HH:mm`);
  const end = dayjs(endTime).format(`HH:mm`);

  const isOffersListHidden = eventOffers.length > 0 ? `` : `visually-hidden`;

  const createOffersListTemplate = (arr) => {
    const Ordered = arr.filter(function (offer) {
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

  const isStar = isFavourite ? `event__favorite-btn--active` : ``;

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
      <button class="event__favorite-btn ${isStar}" type="button">
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
