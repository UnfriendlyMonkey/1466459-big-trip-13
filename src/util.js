import dayjs from "dayjs";

export const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min)) + min;
};

export const getRandomEl = (array) => {
  const rand = Math.floor(Math.random() * array.length);
  return array[rand];
};

export const getRandomArray = (array, count) => {
  let arrayCount = getRandomInt(1, count);
  let randomArray = [];
  for (let i = 0; i < arrayCount; i++) {
    randomArray[i] = getRandomEl(array);
  }
  return randomArray;
};

export const durationString = (beginning, ending) => {
  const duration = dayjs(ending).diff(dayjs(beginning), `minute`);
  const durationDays = Math.floor(duration / 1440);
  const durationHours = Math.floor((duration - durationDays * 1440) / 60);
  const durationMinutes = duration % 60;
  if (durationDays) {
    return `${durationDays}D ${durationHours}H ${durationMinutes}M`;
  }
  if (durationHours) {
    return `${durationHours}H ${durationMinutes}M`;
  }
  return `${durationMinutes}M`;
};
