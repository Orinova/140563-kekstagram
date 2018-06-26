'use strict';

////////////////////////////////////    .js    ////////////////////////////////////
//                                   Остальное                                   //

var KEYCODE_ESC = 27;

var uploadSection = document.querySelector('.img-upload');
var uploadFile = uploadSection.querySelector('#upload-file');
var uploadOverlay = uploadSection.querySelector('.img-upload__overlay');
var uploadCloseBtn = uploadSection.querySelector('.img-upload__cancel');
var uploadImgPreview = uploadSection.querySelector('.img-upload__preview');

var scale = {
  RANGE: 25,
  MIN: 25,
  MAX: 100,
  DEFAULT: 100
};
var resizeControls = uploadSection.querySelector('.resize');
var resizePlus = resizeControls.querySelector('.resize__control--plus');
var resizeMinus = resizeControls.querySelector('.resize__control--minus');
var resizeValue = resizeControls.querySelector('.resize__control--value');



// ------ 2. Начало: Загрузка фото
var openUpload = function () {
  document.querySelector('body').classList.add('modal-open');
  uploadOverlay.classList.remove('hidden');
  document.addEventListener('keydown', onUploadEscPress);
};
var closeUpload = function () {
  document.querySelector('body').classList.remove('modal-open');
  uploadFile.value = '';
  uploadImgPreview.className = 'img-upload__preview';
  uploadImgPreview.style = '';
  setScale('reset');
  effectScale.classList.add('hidden');
  hashtagsInput.value = '';
  descriptionInput.value = '';
  uploadOverlay.classList.add('hidden');
};
var onUploadEscPress = function (evt) {
  if (evt.keyCode === KEYCODE_ESC && evt.target !== hashtagsInput && evt.target !== descriptionInput) {
    closeUpload();
  }
};
uploadFile.addEventListener('change', openUpload);
uploadCloseBtn.addEventListener('click', closeUpload);

// ------------ Масштаб
var setScale = function (command) {
  var valueNum = resizeValue.value.slice(0, -1);
  if (command === 'plus' && valueNum < scale.MAX) {
    valueNum = +valueNum + scale.RANGE;
  }
  if (command === 'minus' && valueNum > scale.MIN) {
    valueNum = +valueNum - scale.RANGE;
  }
  if (command === 'reset') {
    valueNum = scale.DEFAULT;
  }
  uploadImgPreview.style.transform = 'scale(' + valueNum / 100 + ')';
  resizeValue.setAttribute('value', valueNum + '%');
};

resizePlus.addEventListener('click', function () {
  setScale('plus');
});
resizeMinus.addEventListener('click', function () {
  setScale('minus');
});

// ------------ Добавление фильтра на фото

var DEFAULT_EFFECT_VALUE = 100;
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
effectsList.addEventListener('click', getCurrentEffect);
var getSaturation = function () {
  return Math.round(effectPin.offsetLeft / effectLine.offsetWidth * 100);
};
function getCoordX(elem) {
  var box = elem.getBoundingClientRect();
  return box.left + pageXOffset;
}

effectPin.addEventListener('mousedown', function (evt) {
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
});
