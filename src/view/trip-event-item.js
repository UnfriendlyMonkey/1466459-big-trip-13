import dayjs from "dayjs";

export const createTripEventItemTemplate = (item) => {

  const {startTime, endTime, price} = item;
  const type = item.event.type;
  const destination = item.destination.name;
  const startDate = dayjs(startTime).format(`MMM D`);
  const start = dayjs(startTime).format(`HH:mm`);
  const end = dayjs(endTime).format(`HH:mm`);
  const duration = dayjs(endTime).diff(dayjs(startTime), `minute`);
  const durationH = Math.floor(duration / 60);
  const durationM = duration % 60;
  const durationString = () => {
    let result = ``;
    if (durationH) {
      result += `${durationH}H `;
    }
    result += `${durationM}M`;
    return result;
  };
  // const firstOption = item.event.offers[0] ? item.event.offers[0][0] : ``;
  // const firstOptionPrice = firstOption ? item.event.offers[0][1][price] : ``;
  const isHidden = item.event.offers ? `` : `visually-hidden`;

  const createOffersListTemplate = (arr) => {
    let fragment = ``;
    if (!arr) {
      return ``;
    } else {
      for (let i = 0; i < arr.length; i++) {
        if (arr[i][1].isOrdered) {
          fragment += `<li class="event__offer">
            <span class="event__offer-title">${arr[i][0]}</span>
            &plus;&euro;&nbsp;
            <span class="event__offer-price">${arr[i][1].price}</span>
          </li>`;
        }
      }
    }
    return fragment;
  };

  const isFavourite = item.isFavourite ? `event__favorite-btn--active` : ``;

  return `<li class="trip-events__item">
    <div class="event">
      <time class="event__date" datetime="2019-03-18">${startDate}</time>
      <div class="event__type">
        <img class="event__type-icon" width="42" height="42" src="img/icons/${type.toLowerCase()}.png" alt="Event type icon">
      </div>
      <h3 class="event__title">${type} ${destination}</h3>
      <div class="event__schedule">
        <p class="event__time">
          <time class="event__start-time" datetime="2019-03-18T10:30">${start}</time>
          &mdash;
          <time class="event__end-time" datetime="2019-03-18T11:00">${end}</time>
        </p>
        <p class="event__duration">${durationString()}</p>
      </div>
      <p class="event__price">
        &euro;&nbsp;<span class="event__price-value">${price}</span>
      </p>
      <h4 class="visually-hidden">Offers:</h4>
      <ul class="event__selected-offers ${isHidden}">
        ${createOffersListTemplate(item.event.offers)}
      </ul>
      <button class="event__favorite-btn ${isFavourite}" type="button">
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
