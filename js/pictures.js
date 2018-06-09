'use strict';
var QUANTITY = 25; // Количество элементов для вывода на страницу

var likes = {
  min: 15,
  max: 200
};

var comments = {
  possible: 5, //  возможно до 5 комментариев
  min: 1, // в каждом от 1
  max: 2, // до 2 предложений
  avatarCount: 6, // существует 6 типов аватарок
  txt: [
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
// https://teamtreehouse.com/community/mathfloor-mathrandom-max-min-1-min-explanation
var getRandomNum = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Тасование массива
// http://thenewcode.com/1095/Shuffling-and-Sorting-JavaScript-Arrays
// Обязательно ли названия функций, содержащих return начинать с "get"?
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
  var variety = getShuffled(comments.txt);
  var length = getRandomNum(min, max); // получили нужное количество предложений
  var text = variety.slice(0, length); // возвращаем из списка это количество
  return text.join(' '); // возвращаю текст комментария строкой
};


// 1. Генерация массива случайных данных
var getContent = function (quantity) {
  var info = [];

  for (var i = 0; i < quantity; i++) {
    var currentLikes = getRandomNum(likes.min, likes.max); // Определяем количество лайков

    var currentComments = [];
    // Заполняем массив комментариев
    for (var j = 0; j < getRandomNum(1, comments.possible); j++) {
      currentComments[j] = getText(comments.min, comments.max);
    }

    var descriptionIndex = getRandomNum(0, descriptions.length - 1);
    var description = descriptions[descriptionIndex];

    info[i] =
      {
        url: 'photos/' + (i + 1) + '.jpg',
        likes: currentLikes,
        comments: currentComments,
        description: description
      };
  }
  return info;
};

// 2. Создаем DOM элементы
var getElement = function (info) {
  var template = document.querySelector('#picture').content;
  var element = template.cloneNode(true);

  element.querySelector('.picture__img').alt = info.description;
  element.querySelector('.picture__img').src = info.url;
  element.querySelector('.picture__stat--likes').textContent = info.likes;
  element.querySelector('.picture__stat--comments').textContent = info.comments.length;

  return element;
};

// 3. Заполянем блок на странице DOM-элементами
var renderElement = function (info) {
  var box = document.querySelector('.pictures');
  var fragment = document.createDocumentFragment();

  for (var i = 0; i < info.length; i++) {
    fragment.appendChild(getElement(info[i]));
  }

  box.appendChild(fragment);
};

// 4. Покажите элемент .big-picture, удалив у него класс .hidden
// и заполните его данными из созданного массива

var showBigPicture = function (photoId) {
  var bigPicture = document.querySelector('.big-picture');

  // Clear comments
  var ul = bigPicture.querySelector('.social__comments');
  while (ul.firstChild) {
    ul.removeChild(ul.firstChild);
  }

  // Open Photo
  bigPicture.querySelector('.big-picture__img img').src = photoId.url;
  bigPicture.querySelector('.social__caption').textContent = photoId.description;
  bigPicture.querySelector('.likes-count').textContent = photoId.likes;
  bigPicture.querySelector('.comments-count').textContent = photoId.comments.length;
  bigPicture.classList.remove('hidden');

  // Open Comments
  for (var i = 0; i < photoId.comments.length; i++) {
    var li = document.createElement('li');
    li.classList.add('social__comment');
    li.classList.add('social__comment--text');
    ul.appendChild(li);

    var img = document.createElement('img');
    img.classList.add('social__picture');
    var imgUrl = getRandomNum(1, comments.avatarCount);
    img.src = 'img/avatar-' + imgUrl + '.svg';
    img.alt = 'Аватар комментатора фотографии';
    img.width = 35;
    img.height = 35;
    li.appendChild(img);

    var p = document.createElement('p');
    p.textContent = photoId.comments[i];
    li.appendChild(p);
  }

  // 5. Спрячьте блоки
  bigPicture.querySelector('.social__comment-count').classList.add('visually-hidden');
  bigPicture.querySelector('.social__loadmore').classList.add('visually-hidden');
  // в задании указано "social__comment-loadmore", но я не нашла такой класс ни в html, ни в css
};


var fish = getContent(QUANTITY); // Создаем "рыбный" контент
renderElement(fish); // выводим превьюшки
showBigPicture(fish[0]); // Открываем первое фото
