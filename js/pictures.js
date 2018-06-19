'use strict';

var PHOTOS_COUNT = 25;
var AVATAR_VARIANTS = 6;
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

var KEYCODE_ESC = 27;
var picturesSection = document.querySelector('.pictures');
var gallery = document.querySelector('.big-picture');
var galleryCloseBtn = document.querySelector('.big-picture__cancel');

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
var DEFAULT_EFFECT_VALUE = 100;
var uploadEffectScale = uploadSection.querySelector('.scale');
var uploadEffectsList = uploadSection.querySelector('.effects__list');
var uploadEffectValue = uploadSection.querySelector('.scale__value').value;
var uploadEffectPin = uploadSection.querySelector('.scale__pin');
var uploadEffectLine = uploadSection.querySelector('.scale__line');

var resizeControls = uploadSection.querySelector('.resize');
var resizePlus = resizeControls.querySelector('.resize__control--plus');
var resizeMinus = resizeControls.querySelector('.resize__control--minus');
var resizeValue = resizeControls.querySelector('.resize__control--value');


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
var showgallery = function (photo) {
  var commentsList = gallery.querySelector('.social__comments'); // список комментариев (ul)
  var socialComment = gallery.querySelector('.social__comment').cloneNode(true);
  socialComment.classList.add('social__comment--text'); // получили шаблон для комментрия (li)
  commentsList.innerHTML = '';

  var fragment = document.createDocumentFragment();
  for (var i = 0; i < photo.comments.length; i++) {
    var comment = socialComment.cloneNode(true);
    comment.querySelector('.social__picture').src = 'img/avatar-' + getRandomNum(1, AVATAR_VARIANTS) + '.svg';
    comment.querySelector('.social__text').textContent = photo.comments[i];
    fragment.appendChild(comment);
  }
  commentsList.appendChild(fragment);

  // Подставляем инфу в большую картинку
  gallery.querySelector('.big-picture__img img').src = photo.url;
  gallery.querySelector('.social__caption').textContent = photo.description;
  gallery.querySelector('.likes-count').textContent = photo.likes;
  gallery.querySelector('.comments-count').textContent = photo.comments.length;

  // Спрячьте блоки - это по заданию module3-task1, пятый пункт
  gallery.querySelector('.social__comment-count').classList.add('visually-hidden');
  gallery.querySelector('.social__loadmore').classList.add('visually-hidden');
};

var photos = createContent(PHOTOS_COUNT);
fillPicturesList(photos);

// ------ 1. Начало: Галерея
var onPhotoClick = function (evt) {
  var target = evt.target;
  if (target.className === 'picture__img') {
    target = target.parentNode;
    var photoIndex = target.getAttribute('id').substr(6);
    showgallery(photos[photoIndex]);
    openGallery();
  }
};

var openGallery = function () {
  document.querySelector('body').classList.add('modal-open');
  gallery.classList.remove('hidden');
};

var closeGallery = function () {
  document.querySelector('body').classList.remove('modal-open');
  gallery.classList.add('hidden');
};

var galleryEscPress = function (evt) {
  if (evt.keyCode === KEYCODE_ESC) {
    closeGallery();
  }
};

picturesSection.addEventListener('click', onPhotoClick);
galleryCloseBtn.addEventListener('click', closeGallery);
document.addEventListener('keydown', galleryEscPress);
// ------ 1. Конец: Галерея


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
  uploadOverlay.classList.add('hidden');
};
var onUploadEscPress = function (evt) {
  if (evt.keyCode === KEYCODE_ESC) {
    closeUpload();
  }
};
uploadFile.addEventListener('change', openUpload);
uploadCloseBtn.addEventListener('click', closeUpload);

// ------------ Масштаб
var setScale = function (command) {
  var valueNum = resizeValue.value.slice(0, -1);
  if ( command === 'plus' && valueNum < scale.MAX) {
    valueNum = +valueNum + scale.RANGE;
  }
  if ( command === 'minus' && valueNum > scale.MIN) {
    valueNum = +valueNum - scale.RANGE;
  };
  if ( command === 'reset') {
    valueNum = scale.DEFAULT;
  };
  uploadImgPreview.style.transform = 'scale(' + valueNum / 100 + ')';
  resizeValue.setAttribute('value', valueNum + '%');
};

resizePlus.addEventListener('click', function() {
  setScale('plus');
});
resizeMinus.addEventListener('click', function() {
  setScale('minus');
});

// ------------ Фильтры
var effects = {
  chrome: function () {
    return 'grayscale(' + uploadEffectValue / 100 + ')';
  },
  sepia: function () {
    return 'sepia(' + uploadEffectValue / 100 + ')';
  },
  marvin: function () {
    return 'invert(' + uploadEffectValue + '%)';
  },
  phobos: function () {
    return 'blur(' + uploadEffectValue * 3 / 100 + 'px)';
  },
  heat: function () {
    return 'brightness(' + (uploadEffectValue * 2 / 100 + 1) + ')';
  },
  none: function () {
    return '';
  }
};
var currentEffect;
var setCurrentEffect = function (evt) {
  if (evt.target.tagName === 'INPUT') {
    currentEffect = evt.target.value;
    // сбрасываем стили, потом добавляем класс фильтры
    uploadImgPreview.className = 'img-upload__preview';
    uploadImgPreview.classList.add('effects__preview--' + currentEffect);

    // проверяем на необходимость слайдера
    if (currentEffect === 'none') {
      uploadEffectScale.classList.add('hidden');
    } else {
      uploadEffectScale.classList.remove('hidden');
    }

    // Накладываем фильтр
    uploadEffectValue = DEFAULT_EFFECT_VALUE; // указываем стартовый уровень
    uploadImgPreview.style.filter = effects[currentEffect](); // выводим фильтр
  }
};
uploadEffectsList.addEventListener('click', setCurrentEffect);

var getSaturationLevel = function () {
  return Math.round(uploadEffectPin.offsetLeft / uploadEffectLine.offsetWidth * 100);
};
var setSaturation = function () {
  uploadEffectValue = getSaturationLevel();
  uploadImgPreview.style.filter = effects[currentEffect]();
};
uploadEffectPin.addEventListener('mouseup', setSaturation);
// ------ 2. Конец: галерея
