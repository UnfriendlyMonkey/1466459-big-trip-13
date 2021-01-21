import dayjs from "dayjs";

export const makeItemsUniq = (items) => {
  return [...new Set(items)];
};

export const getPointsByType = (points, type) => {
  return points.filter((point) => point.eventType === type);
};

export const countPointsByType = (points, type) => {
  return points.filter((point) => point.eventType === type).length;
};

export const countMoneyByType = (points, type) => {
  const pointsOfType = points.filter((point) => point.eventType === type);
  return pointsOfType.reduce((acc, val) => {
    return acc + val.price;
  }, 0);
};

export const getDurationDays = (point) => {
  const start = point.startTime;
  const end = point.endTime;
  const duration = dayjs(end).diff(dayjs(start), `minute`);
  return duration;
};

export const countTimeByType = (points, type) => {
  const minutesPerDay = 1440;
  const pointsOfType = getPointsByType(points, type);
  const total = pointsOfType.reduce((acc, val) => {
    return acc + getDurationDays(val);
  }, 0);
  return Math.ceil(total / minutesPerDay);
};
