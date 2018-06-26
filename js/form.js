'use strict';
var KEYCODE_ESC = 27; // отправить в utils

(function () {
  var uploadSection = document.querySelector('.img-upload'); // общий с effect.js и scale.js
  var uploadFile = uploadSection.querySelector('#upload-file');
  var uploadOverlay = uploadSection.querySelector('.img-upload__overlay');
  var uploadCloseBtn = uploadSection.querySelector('.img-upload__cancel');

  var openUpload = function () {
    document.querySelector('body').classList.add('modal-open');
    uploadOverlay.classList.remove('hidden');
    document.addEventListener('keydown', onUploadEscPress);
  };

  var closeUpload = function () {
    document.querySelector('body').classList.remove('modal-open');
    uploadOverlay.classList.add('hidden');
    uploadFile.value = '';
    window.scale.setDefault();
    window.effect.setDefault();
    window.validate.clear();
  };

  var onUploadEscPress = function (evt) {
    if (evt.keyCode === KEYCODE_ESC && evt.target.className !== 'text__hashtags' && evt.target.className !== 'text__description') {
      closeUpload();
    }
  };

  uploadFile.addEventListener('change', openUpload);
  uploadCloseBtn.addEventListener('click', closeUpload);
})();
