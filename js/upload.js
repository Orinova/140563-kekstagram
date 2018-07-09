'use strict';

(function () {
  var Hashtag = {
    MAX: 5,
    MIN_LENGTH: 2,
    MAX_LENGTH: 20
  };
  var ErrorText = {
    NO_SHARP: 'Хэш-тег должен начинается с символа # (решётка)',
    EMPTY: 'Вы ввели пустой хэш-тег',
    TOO_LONG: 'Длина хэш-тега не может превышать ' + Hashtag.MAX_LENGTH + ' символов',
    NO_SPACE: 'Разделите хэш-теги пробелами',
    DUBLICATE: 'Хэш-теги не должны повторяться',
    MAX_COUNT: 'Хэш-тегов не может быть более пяти'
  };
  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];
  var uploadSection = document.querySelector('.img-upload');
  var uploadFile = uploadSection.querySelector('#upload-file');
  var uploadPreview = uploadSection.querySelector('.img-upload__preview img');
  var effectsPreviews = uploadSection.querySelectorAll('.effects__preview');
  var uploadOverlay = uploadSection.querySelector('.img-upload__overlay');
  var uploadCloseBtn = uploadSection.querySelector('.img-upload__cancel');

  var uploadForm = document.querySelector('.img-upload__form');
  var uploadSubmit = uploadForm.querySelector('.img-upload__submit');
  var hashtagsInput = uploadForm.querySelector('.text__hashtags');
  var descriptionInput = uploadForm.querySelector('.text__description');
  var defaultEffect = uploadForm.querySelector('#effect-none');

  // ---------- Предпросмотр изображения
  var uploadUserImage = function () {
    var userImage = uploadFile.files[0];
    var userImageName = userImage.name.toLowerCase();
    var matches = FILE_TYPES.some(function (file) {
      return userImageName.endsWith(file);
    });

    if (!matches) {
      window.error.setMessage('Неверный формат файла');
      window.error.show();
      closeUpload();
      return false;
    }

    uploadPreview.src = '';
    var reader = new FileReader();

    reader.addEventListener('load', function () {
      uploadPreview.src = reader.result;
      effectsPreviews.forEach(function (effect) {
        effect.style.backgroundImage = 'url(' + reader.result + ')';
      });
    });

    reader.readAsDataURL(userImage);
    openUpload();
    return true;
  };

  // ---------- Открыть/закрыть/сбросить
  var openUpload = function () {
    document.querySelector('body').classList.add('modal-open');
    uploadOverlay.classList.remove('hidden');
    document.addEventListener('keydown', onUploadEscPress);
    uploadCloseBtn.addEventListener('click', function () {
      resetForm();
      closeUpload();
    });
  };

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

  uploadFile.addEventListener('change', function () {
    uploadUserImage();
  });

  // ---------- Валидация

  var validateHashtags = function () {
    var hashtags = hashtagsInput.value.trim(); // получили значение хэштега, очистили оконечные пробелы
    hashtags = hashtags.toLowerCase(); // сброс регистра
    var errorText = '';

    if (hashtags !== '') { // если поле не пустое, то проверяем его
      hashtags = hashtags.split(/\s+/); // для этого разобъем на массив
      if (hashtags.length > Hashtag.MAX) {
        errorText = ErrorText.MAX_COUNT;
      }

      for (var i = 0; i < hashtags.length; i++) {
        if (hashtags[i][0] !== '#') {
          errorText = ErrorText.NO_SHARP;
        }
        if (hashtags[i].length > Hashtag.MAX_LENGTH) {
          errorText = ErrorText.TOO_LONG;
        }
        if (hashtags[i][0] === '#' && hashtags[i].length < Hashtag.MIN_LENGTH) {
          errorText = ErrorText.EMPTY;
        }
        if (hashtags[i].substring(1).search('#') !== -1) {
          errorText = ErrorText.NO_SPACE;
        }
        if (window.utils.checkDublicate(hashtags, i)) {
          errorText = ErrorText.DUBLICATE;
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
    window.error.show();
  };

  var clearInputs = function () {
    clearErrorText();
    hashtagsInput.value = '';
    descriptionInput.value = '';
    defaultEffect.checked = true;
  };

  window.upload = {
    reset: resetForm,
    repeat: onSubmitClick
  };
})();


