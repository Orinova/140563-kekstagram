'use strict';

var KEYCODE_ESC = 27;
var PHOTOS_COUNT = 25;
var AVATAR_VARIANTS = 6;
var picturesSection = document.querySelector('.pictures');
var bigPicture = document.querySelector('.big-picture');
var likes = {
  MIN: 15,
  MAX: 200
};
var comments = {
  MAX: 5, //  возможно до 5 комментариев
  SENTENCE_MAX: 2, // до 2 предложений
  REPLICAS: [
    'Всё отлично!',
    'В целом всё неплохо. Но не всё.',
    'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
    'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
    'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
    'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
  ]
};
var DESCRIPTIONS = [
  'Тестим новую камеру!',
  'Затусили с друзьями на море',
  'Как же круто тут кормят',
  'Отдыхаем...',
  'Цените каждое мгновенье. Цените тех, кто рядом с вами и отгоняйте все сомненья. Не обижайте всех словами......',
  'Вот это тачка!'
];

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

var generateComments = function (sentenceMax) {
  var currentComments = [];
  for (var j = 0; j < getRandomNum(1, comments.MAX); j++) { // количество комментариев, которое будет у фото
    var variety = getShuffled(comments.REPLICAS); // перетряхиваем массив вариантов
    var length = getRandomNum(1, sentenceMax); // получили нужное количество предложений
    var text = variety.slice(0, length); // возвращаем из списка это количество
    // сюда нужна проверка: если получившийся text совпадает с предыдущими наборами в currentComments, то выбираем заного
    currentComments[j] = (length > 1) ? text.join(' ') : text.join('');
  }
  return currentComments;
};

// Генерация массива случайных данных
var createContent = function (photosCount) {
  var photos = [];
  for (var i = 0; i < photosCount; i++) {
    photos[i] =
      {
        url: 'photos/' + (i + 1) + '.jpg',
        likes: getRandomNum(likes.MIN, likes.MAX),
        comments: generateComments(comments.SENTENCE_MAX),
        description: DESCRIPTIONS[getRandomNum(0, DESCRIPTIONS.length - 1)],
      };
  }
  return photos;
};

// Создаем DOM элементы для переданного массива фотографий
var createPhotoElement = function (index, photo) {
  var photoElement = document.querySelector('#picture').content.cloneNode(true);
  photoElement.querySelector('.picture__link').id = index;
  photoElement.querySelector('.picture__img').alt = photo.description;
  photoElement.querySelector('.picture__img').src = photo.url;
  photoElement.querySelector('.picture__stat--likes').textContent = photo.likes;
  photoElement.querySelector('.picture__stat--comments').textContent = photo.comments.length;
  return photoElement;
};

// Заполянем блок на странице созданными DOM-элементами (превью фотографий)
var fillPicturesList = function (photos) {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < photos.length; i++) {
    /*
    Маше: По ТЗ "Все загруженные изображения показаны на главной странице в виде миниатюр",
    значит я могу присваивать им идентификатор по мере вывода и быть уверенной, что
    цифра в id на превью соответвует позиции в массиве объектов фотографий.

    Мы с тобой обсуждали о том, что бы записать идентификатор в объект photos,
    но в таком случае при удалении какой-нибудь из  фотографий
    id перестал бы соответвовать номеру позиции в массиве и потребовалось бы написать больше проверок.

    Ещё добавила префикс photo_ предположив,
    что по мере работы у меня может появиться потребность в id для других объектов */
    fragment.appendChild(createPhotoElement('photo_' + i, photos[i]));
  }
  picturesSection.appendChild(fragment);
};



// Покажите элемент .big-picture, удалив у него класс .hidden
// и заполните его данными из созданного массива
var showBigPicture = function (photo) {
  var commentsList = bigPicture.querySelector('.social__comments'); // список комментариев (ul)
  var socialComment = bigPicture.querySelector('.social__comment').cloneNode(true);
  socialComment.classList.add('social__comment--text'); // получили шаблон для комментрия (li)
  commentsList.innerHTML = '';

  var fragmentBigPicture = document.createDocumentFragment();
  for (var i = 0; i < photo.comments.length; i++) {
    var comment = socialComment.cloneNode(true);
    comment.querySelector('.social__picture').src = 'img/avatar-' + getRandomNum(1, AVATAR_VARIANTS) + '.svg';
    comment.querySelector('.social__text').textContent = photo.comments[i];
    fragmentBigPicture.appendChild(comment);
  }
  commentsList.appendChild(fragmentBigPicture);

  // Подставляем инфу в большую картинку
  bigPicture.querySelector('.big-picture__img img').src = photo.url;
  bigPicture.querySelector('.social__caption').textContent = photo.description;
  bigPicture.querySelector('.likes-count').textContent = photo.likes;
  bigPicture.querySelector('.comments-count').textContent = photo.comments.length;

  // Спрячьте блоки - это по заданию module3-task1, пятый пункт
  bigPicture.querySelector('.social__comment-count').classList.add('visually-hidden');
  bigPicture.querySelector('.social__loadmore').classList.add('visually-hidden');
};

var photos = createContent(PHOTOS_COUNT);
fillPicturesList(photos);


/////// 1. Начало: Галерея
var picturePreviewClickHandler = function (evt) {
  var target = evt.target;
  if (target.className === 'picture__img') {
    target = target.parentNode;
    var photoIndexNum = target.getAttribute("id").substr(6); // забираю число из id вида photo_00
    showBigPicture(photos[photoIndexNum]);
    openGalleryPopup();
  };
};

var openGalleryPopup = function () {
    document.querySelector('body').classList.add('modal-open');
    bigPicture.classList.remove('hidden');
};

var closeGalleryPopup = function () {
    document.querySelector('body').classList.remove('modal-open');
    bigPicture.classList.add('hidden');
};

var buttonGalleryCloseClickHandler = function (evt) {
  if (evt.target.className === 'big-picture__cancel cancel') closeGalleryPopup();
};

var escGalleryKeydownHandler = function (evt) {
  if (evt.keyCode === KEYCODE_ESC) closeGalleryPopup();
};
document.addEventListener('keydown', escGalleryKeydownHandler);
picturesSection.addEventListener('click', picturePreviewClickHandler);
bigPicture.addEventListener('click', buttonGalleryCloseClickHandler);
/////// 1. Конец: Галерея


////// 2. Начало: Загрузка фото
var uploadSection = document.querySelector('.img-upload');
var uploadFile = uploadSection.querySelector('#upload-file');
var uploadOverlay = uploadSection.querySelector('.img-upload__overlay');
var uploadCloseButton = uploadSection.querySelector('.img-upload__cancel');
var uploadImgPreview = uploadSection.querySelector('.img-upload__preview');

var openUploadPopup = function () {
  document.querySelector('body').classList.add('modal-open');
  uploadOverlay.classList.remove('hidden');
};

var closeUploadPopup = function () {
  document.querySelector('body').classList.remove('modal-open');
  uploadFile.value = '';
  setScale(scale.DEFAULT);
  uploadOverlay.classList.add('hidden');
};

var escUploadPopup = function (evt) {
  if (evt.keyCode === KEYCODE_ESC) {
    closeUploadPopup();
  }
};

uploadFile.addEventListener('change', openUploadPopup);
uploadCloseButton.addEventListener('click', closeUploadPopup);
document.addEventListener('keydown', escUploadPopup);


///////////// 2.1 Начало: Загруженное фото - Масштаб
var scale = {
  RANGE: 25,
  MIN: 25,
  MAX: 100,
  DEFAULT: 100
};
var resize = uploadSection.querySelector('.resize');
var resizeMinus = resize.querySelector('.resize__control--minus');
var resizePlus = resize.querySelector('.resize__control--plus');
var resizeValue = resize.querySelector('.resize__control--value');

var setScale = function (valueNum) {
  uploadImgPreview.style.transform = 'scale(' + valueNum / 100 + ')';
  resizeValue.setAttribute('value', valueNum + '%');
};

var buttonResizePlusClickHandler = function (evt) {
  var valueNum = resizeValue.value.slice(0, -1);
  if (valueNum < scale.MAX) {
    setScale(valueNum += scale.RANGE);
  }
};

var buttonResizeMinusClickHandler = function (evt) {
  var valueNum = resizeValue.value.slice(0, -1);
  if (valueNum > scale.MIN) {
    setScale(valueNum -= scale.RANGE)
  }
};

resizePlus.addEventListener('click', buttonResizePlusClickHandler);
resizeMinus.addEventListener('click', buttonResizeMinusClickHandler);
//////////// 2.1 Конец: Загруженное фото - Масштаб



//////////// 2.2 Начало: Загруженное фото - фильтры
var DEFAULT_EFFECT_VALUE = 100;
var uploadEffectScale = uploadSection.querySelector('.scale');
var uploadEffectsList = uploadSection.querySelector('.effects__list');
var uploadEffectValue = uploadSection.querySelector('.scale__value');

var effects = {
  chrome: function () {
    return 'grayscale(' + uploadEffectValue.value / 100 + ')';
  },
  sepia: function () {
    return 'sepia(' + uploadEffectValue.value / 100 + ')';
  },
  marvin: function () {
    return 'invert(' + uploadEffectValue.value + '%)';
  },
  phobos: function () {
    return 'blur(' + uploadEffectValue.value * 3 / 100 + 'px)';
  },
  heat: function () {
    return 'brightness(' + (uploadEffectValue.value * 2 / 100 + 1) + ')';
  },
  none: function () {
    return '';
  }
};


var setCurrentEffect = function (evt) {
  if (evt.target.tagName === 'INPUT') {
    var currentEffect = evt.target.value;

    // сбрасываем стили, потом добавляем класс фильтры
    uploadImgPreview.className = 'img-upload__preview';
    uploadImgPreview.classList.add('effects__preview--' + currentEffect);

    // проверяем на необходиость слайдера
    if (currentEffect === 'none') {
      uploadEffectScale.classList.add('hidden');
    } else {
      uploadEffectScale.classList.remove('hidden');
    };

    setEffect(currentEffect);
  }
};
uploadEffectsList.addEventListener('click', setCurrentEffect);

var setEffect = function (currentEffect) {
  if (currentEffect in effects) {
    uploadEffectValue.value = DEFAULT_EFFECT_VALUE;
    uploadImgPreview.style.filter = effects[currentEffect]();
  }
};

var setSaturation = function (evt) {
  console.log(uploadEffectValue.value);
  uploadEffectValue.value = uploadSection.querySelector('.scale__value');
};
uploadEffectScale.addEventListener('mouseup', setSaturation);


//////////// 2.2 Конец: Загруженное фото - фильтры

////// 2. Конец: галерея


// console.log();
