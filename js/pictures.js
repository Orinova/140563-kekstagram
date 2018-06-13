'use strict';
var PHOTO_COUNT = 25;
var AVATAR_VARIANTS = 6;

var likes = {
  MIN: 15,
  MAX: 200
};

var comments = {
  MAX: 5, //  возможно до 5 комментариев
  SENTENCE_MIN: 1, // в каждом от 1
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

// Создание текста комментария
var getText = function (min, max) {
  var variety = getShuffled(comments.REPLICAS);
  var length = getRandomNum(min, max); // получили нужное количество предложений
  var text = variety.slice(0, length); // возвращаем из списка это количество
  return text.join(' '); // возвращаю текст комментария строкой
};


// 1. Генерация массива случайных данных
var getContent = function (quantity) {
  var photos = [];

  for (var i = 0; i < quantity; i++) {
    var currentComments = [];
    // Заполняем массив комментариев
    for (var j = 0; j < getRandomNum(1, comments.MAX); j++) {
      currentComments[j] = getText(comments.SENTENCE_MIN, comments.SENTENCE_MAX);
    }

    // если будет функция генерации комментариев для одной картинки,
    // тогда здесь можно будет просто написать comments: generateComments();
    photos[i] =
      {
        url: 'photos/' + (i + 1) + '.jpg',
        likes: getRandomNum(likes.MIN, likes.MAX),
        comments: currentComments,
        description: descriptions[getRandomNum(0, descriptions.length - 1)]
      };
  }
  return photos;
};

// 2. Создаем DOM элементы
var getElement = function (photos) {
  var template = document.querySelector('#picture').content;
  var element = template.cloneNode(true);

  element.querySelector('.picture__img').alt = photos.description;
  element.querySelector('.picture__img').src = photos.url;
  element.querySelector('.picture__stat--likes').textContent = photos.likes;
  element.querySelector('.picture__stat--comments').textContent = photos.comments.length;

  return element;
};

// 3. Заполянем блок на странице DOM-элементами
var renderElement = function (photos) {
  var box = document.querySelector('.pictures');
  var fragment = document.createDocumentFragment();

  for (var i = 0; i < photos.length; i++) {
    fragment.appendChild(getElement(photos[i]));
  }

  box.appendChild(fragment);
};

// 4. Покажите элемент .big-picture, удалив у него класс .hidden
// и заполните его данными из созданного массива

var showBigPicture = function (photo) {
  var bigPicture = document.querySelector('.big-picture');

  // Clear comments
  var commentsList = bigPicture.querySelector('.social__comments');
  while (commentsList.firstChild) {
    commentsList.removeChild(commentsList.firstChild);
  }

  // Open Photo
  bigPicture.querySelector('.big-picture__img img').src = photo.url;
  bigPicture.querySelector('.social__caption').textContent = photo.description;
  bigPicture.querySelector('.likes-count').textContent = photo.likes;
  bigPicture.querySelector('.comments-count').textContent = photo.comments.length;
  bigPicture.classList.remove('hidden');

  // Open Comments
  for (var i = 0; i < photo.comments.length; i++) {
    var li = document.createElement('li');
    li.classList.add('social__comment');
    li.classList.add('social__comment--text');
    commentsList.appendChild(li);

    var img = document.createElement('img');
    img.classList.add('social__picture');
    var imgUrl = getRandomNum(1, AVATAR_VARIANTS);
    img.src = 'img/avatar-' + imgUrl + '.svg';
    img.alt = 'Аватар комментатора фотографии';
    img.width = 35;
    img.height = 35;
    li.appendChild(img);

    var p = document.createElement('p');
    p.textContent = photo.comments[i];
    li.appendChild(p);
  }

  // 5. Спрячьте блоки
  bigPicture.querySelector('.social__comment-count').classList.add('visually-hidden');
  bigPicture.querySelector('.social__loadmore').classList.add('visually-hidden');
  // в задании указано "social__comment-loadmore", но я не нашла такой класс ни в html, ни в css
};


var photos = getContent(PHOTO_COUNT); // Создаем "рыбный" контент
renderElement(photos); // выводим превьюшки
showBigPicture(photos[0]); // Открываем первое фото
