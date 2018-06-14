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

var descriptions = [
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

// 1. Генерация массива случайных данных
var createContent = function (photosCount) {
  var photos = [];
  for (var i = 0; i < photosCount; i++) {
    photos[i] =
      {
        url: 'photos/' + (i + 1) + '.jpg',
        likes: getRandomNum(likes.MIN, likes.MAX),
        comments: generateComments(comments.SENTENCE_MAX),
        description: descriptions[getRandomNum(0, descriptions.length - 1)]
      };
  }
  return photos;
};


// 2. Создаем DOM элементы
var createPhotoElement = function (photos) {
  var photoElement = document.querySelector('#picture').content.cloneNode(true);
  photoElement.querySelector('.picture__img').alt = photos.description;
  photoElement.querySelector('.picture__img').src = photos.url;
  photoElement.querySelector('.picture__stat--likes').textContent = photos.likes;
  photoElement.querySelector('.picture__stat--comments').textContent = photos.comments.length;
  return photoElement;
};

// 3. Заполянем блок на странице DOM-элементами
var fillPicturesList = function (photos) {
  var picturesSection = document.querySelector('.pictures');
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < photos.length; i++) {
    fragment.appendChild(createPhotoElement(photos[i]));
  }
  picturesSection.appendChild(fragment);
};


// 4. Покажите элемент .big-picture, удалив у него класс .hidden
// и заполните его данными из созданного массива

var showBigPicture = function (photo) {
  var bigPicture = document.querySelector('.big-picture'); // ограничиваемся экраном большой фотки
  var socialComments = bigPicture.querySelector('.social__comments'); // список комментариев (ul)
  var socialComment = bigPicture.querySelector('.social__comment').cloneNode(true);
  socialComment.classList.add('social__comment--text'); // получили шаблон для комментрия (li)
  socialComments.innerHTML = ''; // Чистим от прошлых комментариев

  var fragmentBigPicture = document.createDocumentFragment();
  for (var i = 0; i < photo.comments.length; i++) {
    var comment = socialComment.cloneNode(true);
    comment.querySelector('.social__picture').src = 'img/avatar-' + getRandomNum(1, AVATAR_VARIANTS) + '.svg';
    comment.querySelector('.social__text').textContent = photo.comments[i];
    fragmentBigPicture.appendChild(comment);
  }
  socialComments.appendChild(fragmentBigPicture);

  // Open Photo
  bigPicture.querySelector('.big-picture__img img').src = photo.url;
  bigPicture.querySelector('.social__caption').textContent = photo.description;
  bigPicture.querySelector('.likes-count').textContent = photo.likes;
  bigPicture.querySelector('.comments-count').textContent = photo.comments.length;
  bigPicture.classList.remove('hidden');


  // 5. Спрячьте блоки
  bigPicture.querySelector('.social__comment-count').classList.add('visually-hidden');
  bigPicture.querySelector('.social__loadmore').classList.add('visually-hidden');
  // в задании указано "social__comment-loadmore", но я не нашла такой класс ни в html, ни в css
};


var photos = createContent(PHOTOS_COUNT); // Создаем "рыбный" контент
fillPicturesList(photos); // выводим превьюшки
showBigPicture(photos[0]); // Открываем первое фото
