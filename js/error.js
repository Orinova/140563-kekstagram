'use strict';

(function () {
  var uploadForm = document.querySelector('.img-upload__form');
  var uploadStart = document.querySelector('.img-upload__start');
  var errorTemplate = document.querySelector('#picture').content.querySelector('.img-upload__message--error').cloneNode(true);

  var repeatLink = errorTemplate.querySelector('.error__link--repeat');
  var resetLink = errorTemplate.querySelector('.error__link--reset');

  var showError = function () {
    uploadStart.classList.add('hidden');
    errorTemplate.classList.remove('hidden');
    uploadForm.appendChild(errorTemplate);
  };

  var setMessage = function (message) {
    errorTemplate.textContent = message;
  };

  var hideError = function () {
    errorTemplate.classList.add('hidden');
    uploadForm.removeChild(errorTemplate);
    uploadStart.classList.remove('hidden');
  };

  var onReset = function () {
    window.upload.reset();
    hideError();
  };
  var onRepeat = function (evt) {
    window.upload.repeat(evt);
  };

  repeatLink.addEventListener('click', onRepeat);
  resetLink.addEventListener('click', onReset);

  window.error = {
    show: showError,
    setMessage: setMessage
  };

})();
