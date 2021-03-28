"use strict";

const oneSecond = () => 1000;
const getCurrentTime = () => new Date();
const clear = () => {
  console.clear();
};
// функция выводит время в консоль
const log = (message) => console.log(message);
// функция выводит время на фронт
const clock = (message) => {
  const clock = document.getElementById('clock');
  clock.innerText = message;
}

// функция запуска по очереди
const compose = (...fns) => (arg) =>
  fns.reduce((composed, f) => f(composed), arg);

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

// получает объект показания часов и добавляет к нему время суток,
// AM или PM.
const appendAMPM = (clockTime) => ({
  ...clockTime,
  ampm: clockTime.hours >= 12 ? "PM" : "AM",
});

// получает функцию цели target и возвращает функцию, которая будет
// отправлять время в адрес цели.
const display = (target) => (time) => target(time);

// получает шаблонную строку и использует ее для возвращения
// показания времени, отформатированного по критериям, заданным строкой.
const formatClock = (format) => (time) =>
  format
    .replace("hh", time.hours)
    .replace("mm", time.minutes)
    .replace("ss", time.seconds)
    .replace("tt", time.ampm);

// получает в качестве аргумента ключ объекта и ставит нуль впе-
// реди значения, хранящегося под этим ключом объекта. Функция получает ключ
// к указанному полю и ставит перед значениями нуль, если значение меньше 10.
const prependZero = (key) => (clockTime) => ({
  ...clockTime,
  [key]: clockTime[key] < 10 ? "0" + clockTime[key] : clockTime[key],
});

// отдельная функция, получающая в качестве аргумента
// показание времени и преобразующая его в формат гражданского
// времени с помощью обеих форм этого времени.
const convertToCivilianTime = (clockTime) =>
  compose(appendAMPM, civilianHours)(clockTime);

//отдельная функция, получающая в качестве аргумента показание
// времени и обеспечивающая отображение часов, минут и секунд парой цифр,
// подставляя для этого ноль, где необходимо.
const doubleDigits = (civilianTime) =>
  compose(
    prependZero("hours"),
    prependZero("minutes"),
    prependZero("seconds")
  )(civilianTime);


// запускает часы, устанавливая интервал, вызывающий функцию
// обратного вызова каждую секунду. Функция обратного вызова представляет
// собой композицию из всех наших функций. Каждую секунду консоль очищается,
// получается текущее время, показание которого проходит преобразование,
// перевод в гражданский формат, форматирование и отображение
const startTicking = () =>
  setInterval(
    compose(
      clear,
      getCurrentTime,
      serializeClockTime,
      convertToCivilianTime,
      doubleDigits,
      formatClock("hh:mm:ss tt"),
      display(log)
    ),
    oneSecond()
  );

// тоже самое только на фронт
const update = () =>
  compose(
    getCurrentTime,
    serializeClockTime,
    convertToCivilianTime,
    doubleDigits,
    formatClock("hh:mm:ss tt"),
    display(clock)
  )();

let timerId;

// запустить часы
const clockStart = () => {
  timerId = setInterval(update, oneSecond());
  update();
}

// остановить часы
const clockStop = () => {
  clearInterval(timerId);
  timerId = null;
}

document.querySelector(".start").addEventListener("click", clockStart);
document.querySelector(".stop").addEventListener("click", clockStop);

clockStart();