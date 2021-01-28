import Observer from "../utils/observer.js";

export default class TripPointsModel extends Observer {
  constructor() {
    super();
    this._points = [];
    this._destinations = [];
    this._offers = [];
  }

  setPoints(updateType, points) {
    this._points = points.slice();
    this._notify(updateType);
  }

  getPoints() {
    return this._points;
  }

  setDestinations(destinations) {
    this._destinations = destinations.slice();
  }

  getDestinations() {
    return this._destinations;
  }

  setOffers(offers) {
    this._offers = offers.slice();
  }

  getOffers() {
    return this._offers;
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
          photos: destination.pictures,
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

    const adaptedPoint = {
      id: parseInt(point.id, 10),
      eventType: point.type.charAt(0).toUpperCase() + point.type.slice(1),
      startTime: new Date(point.date_from),
      endTime: new Date(point.date_to),
      price: point.base_price,
      isFavorite: point.is_favorite,
      destination: adaptedDest,
      eventOffers: adaptedOffers,
    };

    return adaptedPoint;
  }

  static adaptToServer(point) {
    const destination = point.destination;
    const adaptedDest = Object.assign(
        {},
        destination,
        {
          pictures: destination.photos,
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

    const adaptedPoint = {
      "id": point.id.toString(),
      "type": point.eventType.toLowerCase(),
      "date_from": point.startTime.toISOString(),
      "date_to": point.endTime.toISOString(),
      "is_favorite": point.isFavorite,
      "base_price": point.price,
      "destination": adaptedDest,
      "offers": adaptedOffers,
    };

    return adaptedPoint;
  }
}
