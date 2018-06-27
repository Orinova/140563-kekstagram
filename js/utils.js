'use strict';

(function () {

  var KEYCODE_ESC = 27;

  var isEscEvent = function (evt) {
    return evt.keyCode === KEYCODE_ESC;
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

  window.utils = {
    isEscEvent: isEscEvent,
    getRandomNum: getRandomNum,
    getShuffled: getShuffled
  };

})();
