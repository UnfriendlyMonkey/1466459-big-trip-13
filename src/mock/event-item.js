import {getRandomEl, getRandomArray, getRandomInt} from "../util.js";

const OPTIONS = {
  option1: 250,
  option2: 300,
  option3: 1000,
  option4: 750,
  option5: 500,
  option6: 100,
  option7: 900,
  option8: 50,
  option9: 200,
  option10: 400
};

const getOffers = () => getRandomArray(Object.entries(OPTIONS), 5);

const EVENT_TYPES = {
  taxi: {
    name: `Taxi`,
    offers: getOffers()
  },
  bus: {
    name: `Bus`,
    offers: getOffers()
  },
  train: {
    name: `Train`,
    offers: getOffers()
  },
  ship: {
    name: `Ship`,
    offers: getOffers()
  },
  transport: {
    name: `Transport`,
    offers: getOffers()
  },
  drive: {
    name: `Drive`,
    offers: getOffers()
  },
  flight: {
    name: `Flight`,
    offers: getOffers()
  },
  checkin: {
    name: `Check-in`,
    offers: getOffers()
  },
  sightseeing: {
    name: `Sightseeing`,
    offers: getOffers()
  },
  restaurant: {
    name: `Restaurant`,
    offers: getOffers()
  }
};

const descriptionProto = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus`;

const DESCRIPTIONS = descriptionProto.split(`. `);

const getRandomDescription = () => getRandomArray(DESCRIPTIONS, 5).join(`. `) + `.`;

const getRandomPhotos = () => {
  const photos = [];
  const count = getRandomInt(1, 9);
  for (let i = 0; i <= count; i++) {
    photos[i] = `http://picsum.photos/248/152?r=${Math.random()}`;
  }
  return photos;
};

const DESTINATIONS = {
  Paris: getRandomDescription(),
  London: getRandomDescription(),
  Munich: getRandomDescription(),
  Venice: getRandomDescription(),
  Barcelona: getRandomDescription(),
  Portu: getRandomDescription(),
  Vien: getRandomDescription(),
  Tokyo: getRandomDescription(),
  Ivanovo: getRandomDescription(),
  Mars: getRandomDescription(),
  Deneb: getRandomDescription(),
  Sidney: getRandomDescription()
};


export const generateEventItem = () => {
  const eventType = getRandomEl(Object.keys(EVENT_TYPES));
  // const eventOffers = EVENT_TYPES[eventType];
  const destinationName = getRandomEl(Object.keys(DESTINATIONS));
  // const description = DESTINATIONS[destinationName];
  // const startTime = getRandomInt(0, 2358);


  const eventItem = {
    event: {
      type: EVENT_TYPES[eventType].name,
      offers: EVENT_TYPES[eventType].offers
    },
    destination: {
      name: destinationName,
      description: DESTINATIONS[destinationName],
      photos: getRandomPhotos()
    },
    startTime: null,
    endTime: null,
    price: getRandomInt(100, 2500),
  };
  return eventItem;
};


