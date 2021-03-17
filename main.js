"use strict";

const oneSecond = () => 1000;
const getCurrentTime = () => new Date();
const clear = () => console.clear();
const log = (message) => console.log(message);

// получает объект времени и возвращает объект для
// показания часов, содержащих часы, минуты и секунды
const serializeClockTime = (date) => ({
  hours: date.getHours(),
  minutes: date.getMinutes(),
  seconds: date.getSeconds(),
});

// получает объект показания часов и возвращает объект, где
// показание часов преобразовано к формату гражданского времени.
const civilianHours = (clockTime) => ({
  ...clockTime,
  hours: clockTime.hours > 12 ? clockTime.hours - 12 : clockTime.hours,
});
