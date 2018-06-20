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
var uploadForm = uploadSection.querySelector('.img-upload__form');
var uploadSubmit = uploadForm.querySelector('.img-upload__submit');
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

var MAX_HASHTAGS = 5;
var MAX_HASHTAG_LENGTH = 20;
var hashtagsError = {
  NO_SHARP: 'Хэш-тег должен начинается с символа # (решётка)',
  EMPTY: 'Вы ввели пустой хэш-тег',
  TOO_LONG: 'Длина хэш-тега не может превышать ' + MAX_HASHTAG_LENGTH + ' символов',
  NO_SPACE: 'Разделите хэш-теги пробелами',
  DUBLICATE: 'Хэш-теги не должны повторяться',
  MAX_COUNT: 'Хэш-тегов не может быть более пяти'
};
var hashtagsInput = uploadForm.querySelector('.text__hashtags');
var descriptionInput = uploadForm.querySelector('.text__description');

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
var appendPictures = function (photos) {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < photos.length; i++) {
    fragment.appendChild(createPhotoElement('photo_' + i, photos[i]));
  }
  picturesSection.appendChild(fragment);
};

// Покажите элемент .big-picture, удалив у него класс .hidden
// и заполните его данными из созданного массива
var showGallery = function (photo) {
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
appendPictures(photos);

// ------ 1. Начало: Галерея
var onPhotoClick = function (evt) {
  var target = evt.target;
  if (target.className === 'picture__img') {
    target = target.parentNode;
    var photoIndex = target.getAttribute('id').substr(6);
    showGallery(photos[photoIndex]);
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
  /*
    Тут не успела подумать как сделать запись короче...
    И как избавиться от того, что функция galleryEscPress добавляет второй скролл (снимает класс modal-open),
  */
  if (evt.keyCode === KEYCODE_ESC && evt.target !== hashtagsInput && evt.target !== descriptionInput) {
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
  hashtagsInput.value = '';
  descriptionInput.value = '';
  uploadOverlay.classList.add('hidden');
};
var onUploadEscPress = function (evt) {
  /*
    Тут не успела подумать как сделать запись короче...
    И как избавиться от того, что функция galleryEscPress добавляет второй скролл (снимает класс modal-open),
  */
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


// ------ 3. Начало: валидация
var validateHashtags = function () {
  var hashtags = hashtagsInput.value.trim(); // получили значение хэштега, очистили оконечные пробелы
  hashtags = hashtags.toLowerCase(); // сброс регистра

  if (hashtags !== '') { // если поле не пустое, то проверяем его
    hashtags = hashtags.split(/\s+/); // для этого разобъем на массив

    if (hashtags.length > MAX_HASHTAGS) {
      return hashtagsError.MAX_COUNT;
    }
    for (var i = 0; i < hashtags.length; i++) {
      if (hashtags[i][0] !== '#') {
        return hashtagsError.NO_SHARP;
      }
      if (hashtags[i].length > 20) {
        return hashtagsError.TOO_LONG;
      }
      if (hashtags[i][0] === '#' && hashtags[i].length < 2) {
        return hashtagsError.EMPTY;
      }
      if (hashtags[i].substring(1).search('#') !== -1) {
        return hashtagsError.NO_SPACE;
      }
      if (checkDublicate(hashtags, i)) {
        return hashtagsError.DUBLICATE;
      }

      /*
      Не смогла придумать как записать так, чтобы возвращаемые false не ломали мне код =)
      return hashtags[i][0] !== '#' ? hashtagsError.NO_SHARP : false;
      return hashtags[i].length > 20 ? hashtagsError.TOO_LONG : false;
      return hashtags[i][0] === '#' && hashtags[i].length < 2 ? hashtagsError.EMPTY : false;
      return hashtags[i].substring(1).search('#') !== -1 ? hashtagsError.NO_SPACE : false;
      return checkDublicate(hashtags, i) ? hashtagsError.DUBLICATE : false;
      */
    }
  }
  return false;
};

var clearErrorText = function () {
  hashtagsInput.setCustomValidity('');
};
hashtagsInput.addEventListener('keyup', clearErrorText);

var checkDublicate = function (array, index) {
  for (var i = 0; i < array.length; i++) {
    if (array[index] === array[i] && index !== i) {
      return true;
    }
  }
  return false;
};

var onSubmitClick = function () {
  if (validateHashtags()) {
    var errorText = validateHashtags();
    hashtagsInput.setCustomValidity(errorText);
    hashtagsInput.style.border = '2px red solid';
  }
  return false;
};
uploadSubmit.addEventListener('click', onSubmitClick);


// СДЕЛАТЬ: Не закрывать аплоад-окно по эску, когда фокус на комментарии или хэштегах
// ------ 3. Конец: валидация

