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

  var uploadForm = document.querySelector('.img-upload__form');
  var uploadStart = document.querySelector('.img-upload__start');
  var errorTemplate = document.querySelector('#picture').content.querySelector('.img-upload__message--error').cloneNode(true);

  var showError = function (errorMessage) {
    uploadStart.classList.add('hidden');

    if (errorMessage) {
      errorTemplate.textContent = errorMessage;
    }
    errorTemplate.classList.remove('hidden');
    uploadForm.appendChild(errorTemplate);

    var repeatLink = errorTemplate.querySelector('.error__link--repeat');
    repeatLink.addEventListener('click', onRepeat);

    var resetLink = errorTemplate.querySelector('.error__link--reset');
    resetLink.addEventListener('click', onReset);
  };

  var onReset = function () {
    window.upload.reset();
    uploadForm.removeChild(errorTemplate);
    uploadStart.classList.remove('hidden');
  };

  var onRepeat = function () {
    window.upload.open();
    uploadForm.removeChild(errorTemplate);
    uploadStart.classList.remove('hidden');
  };

  window.utils = {
    isEscEvent: isEscEvent,
    getRandomNum: getRandomNum,
    getShuffled: getShuffled,
    showError: showError
  };
})();
