import AbstractView from "./abstract.js";
import dayjs from "dayjs";

const createTripInfoSectionTemplate = (points) => {
  let fromDate = `...`;
  let toDate = `...`;
  let totalPrice = `...`;
  let renderRoute = `...`;
  if (points && points.length > 0) {
    fromDate = dayjs(points[0].startTime).format(`D MMM`);
    toDate = dayjs(points[points.length - 1].endTime).format(`D MMM`);
    const destinations = points.map((point) => point.destination.name);
    const uniquePoints = new Set(destinations);
    uniquePoints.delete(points[0].destination.name);
    uniquePoints.delete(points[points.length - 1].destination.name);
    const renderMiddlePoint = () => {
      switch (uniquePoints.size) {
        case 0:
          return ``;
        case 1:
          return `${Array.from(uniquePoints)[0]}  &mdash; `;
        default:
          return `...  &mdash; `;
      }
    };
    renderRoute = `${points[0].destination.name} &mdash; ${renderMiddlePoint()}${points[points.length - 1].destination.name}`;

    const offersPrice = (item) => {
      const ordered = item.eventOffers.filter(function (offer) {
        return offer.isOrdered;
      });
      return ordered.
        reduce((accumulator, currentValue) => {
          return accumulator + currentValue.price;
        }, 0);
    };

    totalPrice = points.reduce((accumulator, currentValue) => {
      return accumulator + (currentValue.price + offersPrice(currentValue));
    }, 0);
  }

  return `<section class="trip-main__trip-info  trip-info">
    <div class="trip-info__main">
      <h1 class="trip-info__title">${renderRoute}</h1>

      <p class="trip-info__dates">${fromDate}&nbsp;&mdash;&nbsp;${toDate}</p>
    </div>

    <p class="trip-info__cost">
      Total: &euro;&nbsp;<span class="trip-info__cost-value">${totalPrice}</span>
    </p>
  </section>`;
};

export default class TripInfo extends AbstractView {
  constructor(points) {
    super();
    this._points = points;
  }

  getTemplate() {
    return createTripInfoSectionTemplate(this._points);
  }
}
