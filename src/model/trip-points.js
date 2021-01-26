import Observer from "../utils/observer.js";

export default class TripPointsModel extends Observer {
  constructor() {
    super();
    this._points = [];
  }

  setPoints(points) {
    this._points = points.slice();
  }

  getPoints() {
    return this._points;
  }

  updatePoint(updateType, update) {
    const index = this._points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error(`No such trip point was found`);
    }

    this._points = [
      ...this._points.slice(0, index),
      update,
      ...this._points.slice(index + 1)
    ];

    this._notify(updateType, update);
  }

  addPoint(updateType, update) {
    this._points = [
      update,
      ...this._points
    ];

    this._notify(updateType, update);
  }

  deletePoint(updateType, update) {
    const index = this._points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error(`No such trip point was found`);
    }

    this._points = [
      ...this._points.slice(0, index),
      ...this._points.slice(index + 1)
    ];

    this._notify(updateType, update);
  }

  static adaptToClient(point) {
    const destination = point.destination;
    const adaptedDest = Object.assign(
        {},
        destination,
        {
          photos: destination.pictures.map((picture) => picture.src),
        }
    );

    delete adaptedDest.pictures;

    const offers = point.offers;
    const adaptedOffers = offers.map((offer) => {
      const adaptedOrder = Object.assign(
          {},
          offer,
          {
            name: offer.title,
            isOrdered: true
          }
      );
      delete adaptedOrder.title;
      return adaptedOrder;
    });

    const adaptedPoint = Object.assign(
        {},
        point,
        {
          id: parseInt(point.id, 10),
          eventType: point.type.charAt(0).toUpperCase() + point.type.slice(1),
          startTime: new Date(point.date_from),
          endTime: new Date(point.date_to),
          price: point.base_price,
          isFavorite: point.is_favorite,
          destination: adaptedDest,
          eventOffers: adaptedOffers,
        }
    );

    delete adaptedPoint.type;
    delete adaptedPoint.date_from;
    delete adaptedPoint.date_to;
    delete adaptedPoint.is_favorite;
    delete adaptedPoint.base_price;
    delete adaptedPoint.offers;

    return adaptedPoint;
  }

  static adaptToServer(point) {
    const destination = point.destination;
    const adaptedDest = Object.assign(
        {},
        destination,
        {
          pictures: destination.photos.map((photo) => {
            return {
              "src": photo,
              "description": `just to fill the description for a while`,
            };
          }),
        }
    );
    delete adaptedDest.photos;

    const offers = point.eventOffers;
    const filteredOffers = offers.filter((offer) => offer.isOrdered);
    const adaptedOffers = filteredOffers.map((offer) => {
      const adaptedOrder = Object.assign(
          {},
          offer,
          {
            "title": offer.name,
          }
      );
      delete adaptedOrder.name;
      delete adaptedOrder.isOrdered;
      return adaptedOrder;
    });

    const adaptedPoint = Object.assign(
        {},
        point,
        {
          "id": point.id.toString(),
          "type": point.eventType.toLowerCase(),
          "date_from": point.startTime.toISOString(),
          "date_to": point.endTime.toISOString(),
          "is_favorite": point.isFavorite,
          "base_price": point.price,
          "destination": adaptedDest,
          "offers": adaptedOffers,
        }
    );

    delete adaptedPoint.eventType;
    delete adaptedPoint.startTime;
    delete adaptedPoint.endTime;
    delete adaptedPoint.isFavorite;
    delete adaptedPoint.price;
    delete adaptedPoint.eventOffers;

    return adaptedPoint;
  }
}
