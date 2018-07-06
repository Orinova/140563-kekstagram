'use strict';

(function () {

  var KEYCODE_ESC = 27;
  var KEYCODE_ENTER = 13;
  var DEBOUNCE_INTERVAL = 500;

  var isEscEvent = function (evt) {
    return evt.keyCode === KEYCODE_ESC;
  };

  var isEnterEvent = function (evt) {
    return evt.keyCode === KEYCODE_ENTER;
  };

  // Генератор случайных чисел
  var getRandomNum = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  // Тасование массива
  var getShuffled = function (array) {
    for (var i = array.length - 1; i > 0; i--) {
      var j = getRandomNum(0, i);
      var temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
    return array;
  };

  var debounce = function (fun) {
    var lastTimeout = null;

    return function () {
      var args = arguments;
      if (lastTimeout) {
        window.clearTimeout(lastTimeout);
      }
      lastTimeout = window.setTimeout(function () {
        fun.apply(null, args);
      }, DEBOUNCE_INTERVAL);
    };
  };

  window.utils = {
    isEscEvent: isEscEvent,
    isEnterEvent: isEnterEvent,
    getRandomNum: getRandomNum,
    getShuffled: getShuffled,
    debounce: debounce
  };
})();
