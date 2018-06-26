'use strict';

(function () {
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

  var uploadForm = document.querySelector('.img-upload__form');
  var uploadSubmit = uploadForm.querySelector('.img-upload__submit');
  var hashtagsInput = uploadForm.querySelector('.text__hashtags');
  var descriptionInput = uploadForm.querySelector('.text__description');

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
      hashtagsInput.setCustomValidity(errorText);
    }
  };

  var clearErrorText = function () {
    hashtagsInput.setCustomValidity('');
  };
  hashtagsInput.addEventListener('keyup', clearErrorText);

  var onSubmitClick = function () {
    if (validateHashtags()) {
      var errorText = validateHashtags();
      hashtagsInput.setCustomValidity(errorText);
    }
    return false;
  };
  uploadSubmit.addEventListener('click', onSubmitClick);
})();
