import {FilterType} from "./const.js";
import dayjs from "dayjs";

const isPointIsFuture = (startTime) => {
  return dayjs(startTime).isAfter(dayjs());
};

const isPointIsPast = (startTime) => {
  return dayjs().isAfter(dayjs(startTime));
};


export const filter = {
  [FilterType.EVERYTHING]: (points) => points,
  [FilterType.FUTURE]: (points) => points.filter((point) => isPointIsFuture(point.startTime)),
  [FilterType.PAST]: (points) => points.filter((point) => isPointIsPast(point.startTime))
};
