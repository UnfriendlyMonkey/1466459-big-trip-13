export const sortDate = (pointA, pointB) => {
  return pointA.startTime - pointB.startTime;
};

export const sortDuration = (pointA, pointB) => {
  const durationA = pointA.endTime - pointA.startTime;
  const durationB = pointB.endTime - pointB.startTime;
  return durationB - durationA;
};

export const sortPrice = (pointA, pointB) => {
  return pointB.price - pointA.price;
};
