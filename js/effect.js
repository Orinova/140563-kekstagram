'use strict';

(function () {
  var DEFAULT_EFFECT_VALUE = 100;
  var uploadSection = document.querySelector('.img-upload');
  var uploadImgPreview = uploadSection.querySelector('.img-upload__preview');

  var effectScale = uploadSection.querySelector('.scale');
  var effectsList = uploadSection.querySelector('.effects__list');
  var effectLine = uploadSection.querySelector('.scale__line');
  var effectPin = uploadSection.querySelector('.scale__pin');
  var effectLevel = uploadSection.querySelector('.scale__level');
  var effectSaturation = uploadSection.querySelector('.scale__value');

  var setEffect = function (effect, level) {
    var result;
    switch (effect) {
      case 'chrome':
        result = 'grayscale(' + level / 100 + ')';
        break;
      case 'sepia':
        result = 'sepia(' + level / 100 + ')';
        break;
      case 'marvin':
        result = 'invert(' + level + '%)';
        break;
      case 'phobos':
        result = 'blur(' + level * 3 / 100 + 'px)';
        break;
      case 'heat':
        result = 'brightness(' + (level * 2 / 100 + 1) + ')';
        break;
      default: result = 'none';
        break;
    }
    uploadImgPreview.style.filter = result;
    effectSaturation.setAttribute('value', level);
  };

  var switchEffect = function (evt) {
    var target = evt.target;
    if (target.tagName === 'INPUT') {
      var effectName = target.value;
      uploadImgPreview.className = 'img-upload__preview'; // сброс ранее выбранного класса
      uploadImgPreview.classList.add('effects__preview--' + effectName); // добавляем новый класс фильтра

      // проверяем нужен ли слайдер
      if (effectName === 'none') {
        effectScale.classList.add('hidden');
      } else {
        effectScale.classList.remove('hidden');
        setEffect(effectName, DEFAULT_EFFECT_VALUE); // устаналиваем фильтр и его глубину в стартовом значении
        effectPin.style.left = effectLine.offsetWidth + 'px'; // пин на 100%
        effectLevel.style.width = effectLine.offsetWidth + 'px'; // полоску уровеня на 100%
      }
    }
  };
  effectsList.addEventListener('click', function (evt) {
    switchEffect(evt);
  });

  // ------------ Перетаскивание пина и управление насыщенностью

  var getCurrentEffect = function () {
    return effectsList.querySelector('.effects__radio:checked').value;
  };
  effectsList.addEventListener('click', function () {
    getCurrentEffect();
  });
  var getSaturation = function () {
    return Math.round(effectPin.offsetLeft / effectLine.offsetWidth * 100);
  };
  var getCoordX = function (elem) {
    var box = elem.getBoundingClientRect();
    return box.left + pageXOffset;
  };

  var setPin = function (evt) {
    evt.preventDefault();
    var start = evt.clientX;
    var maxOffset = effectLine.offsetWidth;
    var minOffset = getCoordX(effectLevel);
    var onMouseMove = function (moveEvt) {
      moveEvt.preventDefault();
      if (moveEvt.clientX <= minOffset || moveEvt.clientX >= minOffset + maxOffset) {
        // при выходе указателя за пределы шкалы выходим из функции
        return;
      }
      var shift = start - moveEvt.clientX;
      start = moveEvt.clientX;
      var pinShift = effectPin.offsetLeft - shift;
      if (pinShift >= 0 && pinShift <= maxOffset) {
        effectPin.style.left = pinShift + 'px';
        effectLevel.style.width = pinShift + 'px';
        setEffect(getCurrentEffect(), getSaturation());
      }
    };
    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };
  effectPin.addEventListener('mousedown', setPin);

  var setDefault = function () {
    uploadImgPreview.className = 'img-upload__preview'; // очистить класс фильтра
    uploadImgPreview.style = ''; // очистить фильтр
    effectScale.classList.add('hidden'); // спятать ползунок
  };

  window.effect = {
    setDefault: setDefault
  };

})();
