'use strict';

(function () {

  var uploadSection = document.querySelector('.img-upload'); // общий с effect.js и scale.js
  var uploadFile = uploadSection.querySelector('#upload-file');
  var uploadOverlay = uploadSection.querySelector('.img-upload__overlay');
  var uploadCloseBtn = uploadSection.querySelector('.img-upload__cancel');

  var uploadForm = document.querySelector('.img-upload__form');
  var uploadSubmit = uploadForm.querySelector('.img-upload__submit');
  var hashtagsInput = uploadForm.querySelector('.text__hashtags');
  var descriptionInput = uploadForm.querySelector('.text__description');

  var MAX_HASHTAGS = 5;
  var MAX_HASHTAG_LENGTH = 20;
  var errors = {
    NO_SHARP: 'Хэш-тег должен начинается с символа # (решётка)',
    EMPTY: 'Вы ввели пустой хэш-тег',
    TOO_LONG: 'Длина хэш-тега не может превышать ' + MAX_HASHTAG_LENGTH + ' символов',
    NO_SPACE: 'Разделите хэш-теги пробелами',
    DUBLICATE: 'Хэш-теги не должны повторяться',
    MAX_COUNT: 'Хэш-тегов не может быть более пяти'
  };

  var openUpload = function () {
    document.querySelector('body').classList.add('modal-open');
    uploadOverlay.classList.remove('hidden');
    document.addEventListener('keydown', onUploadEscPress);
    uploadCloseBtn.addEventListener('click', closeUpload);
  };
  uploadFile.addEventListener('change', function () { // в openUpload в обработчик добавь resetForm()
    resetForm();
    openUpload();
  });

  var closeUpload = function () {
    document.querySelector('body').classList.remove('modal-open');
    uploadOverlay.classList.add('hidden');
    document.removeEventListener('keydown', onUploadEscPress);
  };

  var resetForm = function () {
    uploadFile.value = '';
    window.scale.setDefault();
    window.effect.setDefault();
    clearInputs();
  };

  var onUploadEscPress = function (evt) {
    if (window.utils.isEscEvent(evt)) {
      closeUpload();
      resetForm();
    }
  };

  hashtagsInput.addEventListener('focusin', function () {
    document.removeEventListener('keydown', onUploadEscPress);
  });

  hashtagsInput.addEventListener('focusout', function () {
    document.addEventListener('keydown', onUploadEscPress);
  });

  descriptionInput.addEventListener('focusin', function () {
    document.removeEventListener('keydown', onUploadEscPress);
  });

  descriptionInput.addEventListener('focusout', function () {
    document.addEventListener('keydown', onUploadEscPress);
  });

  // ---------- Валидация

  var checkDublicate = function (array, index) {
    for (var i = 0; i < array.length; i++) {
      if (array[index] === array[i] && index !== i) {
        return true;
      }
    }
    return false;
  };

  var validateHashtags = function () {
    var hashtags = hashtagsInput.value.trim(); // получили значение хэштега, очистили оконечные пробелы
    hashtags = hashtags.toLowerCase(); // сброс регистра
    var errorText = '';

    if (hashtags !== '') { // если поле не пустое, то проверяем его
      hashtags = hashtags.split(/\s+/); // для этого разобъем на массив
      if (hashtags.length > MAX_HASHTAGS) {
        errorText = errors.MAX_COUNT;
      }

      for (var i = 0; i < hashtags.length; i++) {
        if (hashtags[i][0] !== '#') {
          errorText = errors.NO_SHARP;
        }
        if (hashtags[i].length > 20) {
          errorText = errors.TOO_LONG;
        }
        if (hashtags[i][0] === '#' && hashtags[i].length < 2) {
          errorText = errors.EMPTY;
        }
        if (hashtags[i].substring(1).search('#') !== -1) {
          errorText = errors.NO_SPACE;
        }
        if (checkDublicate(hashtags, i)) {
          errorText = errors.DUBLICATE;
        }
      }
    }
    return errorText;
  };

  var clearErrorText = function () {
    hashtagsInput.setCustomValidity('');
  };
  hashtagsInput.addEventListener('keyup', clearErrorText);

  var onSubmitClick = function (evt) {
    var errorText = validateHashtags();
    if (errorText) {
      hashtagsInput.setCustomValidity(errorText);
    } else {
      evt.preventDefault(evt);
      window.backend.upload(new FormData(uploadForm), onSuccess, onError);
    }
  };
  uploadSubmit.addEventListener('click', onSubmitClick);

  var onSuccess = function () {
    resetForm();
    closeUpload();
  };

  var onError = function () {
    closeUpload();
    window.errors.show();
  };

  var clearInputs = function () {
    clearErrorText();
    hashtagsInput.value = '';
    descriptionInput.value = '';
  };

  window.upload = {
    reset: resetForm,
    repeat: onSubmitClick
  };
})();
