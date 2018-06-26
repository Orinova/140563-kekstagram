'use strict';

(function () {
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
      var variety = getShuffled(comments.REPLICAS); // перетряхиваем массив вариантов фраз
      var length = getRandomNum(1, sentenceMax); // получили нужное количество предложений (одна или две)
      var text = variety.slice(0, length); // "срезаем" из перемешанного массива это количество
      text = (length > 1) ? text.join(' ') : text.join(''); // если предложений два, то добавляем пробел между ними
      currentComments[j] = {
        text: text,
        avatar: 'img/avatar-' + getRandomNum(1, AVATAR_VARIANTS) + '.svg' // слаучайная аватарка для комментария
      };
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

  // запускаем генерацию информации на 25 (PHOTOS_COUNT) карточек и отдаем массив
  window.data = createContent(PHOTOS_COUNT);
})();
