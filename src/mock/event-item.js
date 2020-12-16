import {getRandomEl, getRandomArray, getRandomInt} from "../utils/common.js";
import dayjs from "dayjs";

const generateId = () => Date.now() % 1000000 + parseInt(Math.random() * 10000, 10);

const OPTIONS = [
  {
    name: `option1`,
    price: 25,
    isOrdered: Boolean(getRandomInt(0, 2))
  },
  {
    name: `option2`,
    price: 35,
    isOrdered: Boolean(getRandomInt(0, 2))
  },
  {
    name: `option3`,
    price: 90,
    isOrdered: Boolean(getRandomInt(0, 2))
  },
  {
    name: `option4`,
    price: 75,
    isOrdered: Boolean(getRandomInt(0, 2))
  },
  {
    name: `option5`,
    price: 10,
    isOrdered: Boolean(getRandomInt(0, 2))
  },
  {
    name: `option6`,
    price: 20,
    isOrdered: Boolean(getRandomInt(0, 2))
  },
  {
    name: `option7`,
    price: 80,
    isOrdered: Boolean(getRandomInt(0, 2))
  },
  {
    name: `option8`,
    price: 65,
    isOrdered: Boolean(getRandomInt(0, 2))
  },
  {
    name: `option9`,
    price: 40,
    isOrdered: Boolean(getRandomInt(0, 2))
  },
  {
    name: `option10`,
    price: 50,
    isOrdered: Boolean(getRandomInt(0, 2))
  }
];

const getOffers = () => {
  let offers = [];
  const isOffers = getRandomInt(0, 5);
  if (isOffers) {
    offers = getRandomArray(OPTIONS, 5);
  }
  return offers;
};

export const EVENT_TYPES = {
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
  [`check-in`]: {
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

const descriptions = descriptionProto.split(`. `);

const getRandomDescription = () => getRandomInt(0, 5) ? getRandomArray(descriptions, 5).join(`. `) + `.` : ``;

const getRandomPhotos = () => {
  const photos = [];
  const count = getRandomInt(1, 9);
  for (let i = 0; i <= count; i++) {
    photos[i] = `http://picsum.photos/248/152?r=${Math.random()}`;
  }
  return photos;
};

export const DESTINATIONS = {
  Amsterdam: [getRandomDescription(), getRandomPhotos()],
  London: [getRandomDescription(), getRandomPhotos()],
  Munich: [getRandomDescription(), getRandomPhotos()],
  Venice: [getRandomDescription(), getRandomPhotos()],
  Barcelona: [getRandomDescription(), getRandomPhotos()],
  Portu: [getRandomDescription(), getRandomPhotos()],
  Vien: [getRandomDescription(), getRandomPhotos()],
  Tokyo: [getRandomDescription(), getRandomPhotos()],
  Ivanovo: [getRandomDescription(), getRandomPhotos()],
  Chamonix: [getRandomDescription(), getRandomPhotos()],
  Geneva: [getRandomDescription(), getRandomPhotos()],
  Sidney: [getRandomDescription(), getRandomPhotos()]
};

const getRandomDate = (startDate, maxGap = 10000) => {
  const daysGap = getRandomInt(1, maxGap);
  return dayjs(startDate).add(daysGap, `minute`);
};

export const generateEventItem = () => {
  const eventType = getRandomEl(Object.keys(EVENT_TYPES));
  const destinationName = getRandomEl(Object.keys(DESTINATIONS));
  const startTime = getRandomDate(dayjs(), 10000);

  const eventItem = {
    id: generateId(),
    eventType: EVENT_TYPES[eventType].name,
    eventOffers: EVENT_TYPES[eventType].offers,
    destination: {
      name: destinationName,
      description: DESTINATIONS[destinationName][0],
      photos: DESTINATIONS[destinationName][1]
    },
    startTime: startTime.toDate(),
    endTime: getRandomDate(startTime, 1500).toDate(),
    price: getRandomInt(50, 1000),
    isFavourite: Boolean(getRandomInt(0, 2))
  };
  return eventItem;
};
