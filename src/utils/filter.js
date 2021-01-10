import {FilterType} from "./const.js";
import dayjs from "dayjs";

const isPointIsFuture = (startTime) => {
  return dayjs(startTime).isAfter(dayjs()) ? true : false;
};

const isPointIsPast = (startTime) => {
  return dayjs().isAfter(dayjs(startTime)) ? true : false;
};


export const filter = {
  [FilterType.EVERYTHING]: (points) => points.filter((point) => isPointIsPast(point.startTime) || isPointIsFuture(point.startTime)),
  [FilterType.FUTURE]: (points) => points.filter((point) => isPointIsFuture(point.startTime)),
  [FilterType.PAST]: (points) => points.filter((point) => isPointIsPast(point.startTime))
};
