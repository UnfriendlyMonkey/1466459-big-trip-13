import dayjs from "dayjs";
export const createTripInfoTemplate = (arr) => {
  const fromDate = dayjs(arr[0].startTime).format(`D MMM`);
  const toDate = dayjs(arr[arr.length - 1].endTime).format(`D MMM`);
  const destinations = [];
  for (let i = 0; i < arr.length; i++) {
    destinations.push(arr[i].destination.name);
  }
  const uniquePoints = new Set(destinations);
  uniquePoints.delete(arr[0].destination.name);
  uniquePoints.delete(arr[arr.length - 1].destination.name);
  const middlePoint = uniquePoints.size === 1 ? `${Array.from(uniquePoints)[0]}` : `...`;
  const totalPrice = arr.reduce((accumulator, currentValue) => {
    return accumulator + currentValue.price;
  }, 0);

  return `<section class="trip-main__trip-info  trip-info">
    <div class="trip-info__main">
      <h1 class="trip-info__title">${arr[0].destination.name} &mdash; ${middlePoint} &mdash; ${arr[arr.length - 1].destination.name}</h1>

      <p class="trip-info__dates">${fromDate}&nbsp;&mdash;&nbsp;${toDate}</p>
    </div>

    <p class="trip-info__cost">
      Total: &euro;&nbsp;<span class="trip-info__cost-value">${totalPrice}</span>
    </p>
  </section>`;
};
