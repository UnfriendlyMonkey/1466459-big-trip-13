import dayjs from "dayjs";

const MINUTES = {
  perHour: 60,
  perDay: 1440
};

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
  const durationDays = Math.floor(duration / MINUTES.perDay);
  const durationHours = Math.floor((duration - durationDays * MINUTES.perDay) / MINUTES.perHour);
  const durationMinutes = duration % MINUTES.perHour;
  if (durationDays) {
    return `${durationDays}D ${durationHours}H ${durationMinutes}M`;
  }
  if (durationHours) {
    return `${durationHours}H ${durationMinutes}M`;
  }
  return `${durationMinutes}M`;
};

export const renderElement = (container, element, place) => {
  switch (place) {
    case `afterbegin`:
      container.prepend(element);
      break;
    case `beforeend`:
      container.append(element);
      break;
    case `afterend`:
      container.after(element);
  }
};

export const renderTemplate = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

export const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;
  return newElement.firstChild;
};
