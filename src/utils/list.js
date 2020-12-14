export const sortByDate = (pointA, pointB) => {
  return pointA.startTime - pointB.startTime;
};

export const sortByDuration = (pointA, pointB) => {
  const durationA = pointA.endTime - pointA.startTime;
  const durationB = pointB.endTime - pointB.startTime;
  return durationB - durationA;
};

export const sortByPrice = (pointA, pointB) => {
  return pointB.price - pointA.price;
};
