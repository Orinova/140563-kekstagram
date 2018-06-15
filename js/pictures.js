'use strict';

var PHOTOS_COUNT = 25;
var AVATAR_VARIANTS = 6;
var picturesSection = document.querySelector('.pictures');

var bigPicture = document.querySelector('.big-picture');

var uploadSection = document.querySelector('.img-upload');
var uploadFile = uploadSection.querySelector('#upload-file');
var uploadOverlay = uploadSection.querySelector('.img-upload__overlay');
var uploadCloseButton = uploadSection.querySelector('.img-upload__cancel');
var uploadScalePin = uploadSection.querySelector('.scale__pin');
var uploadScaleLevel = uploadSection.querySelector('.scale__level');


var KEYCODE_ESC = 27;

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

    Если бы я записала в объект, то в случае удаления какой-нибудь из  фотографий
    id перестал бы соответвовать номеру позиции в массиве и потребовалось бы больше проверок.

    Так же я заморочилась добавляя префикс photo_ предположив,
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

/* ТЗ
4.3. При нажатии на любую из миниатюр, показывается блок .big-picture,
содержащий полноэкранное изображение с количеством лайков и комментариев.
Злементу body задаётся класс modal-open. Данные, описывающие изображение
должны подставляться в соответствующие элементы в разметке.

4.4. Выход из полноэкранного режима просмотра фотографии осуществляется либо
нажатием на иконку крестика .big-picture__cancel в правом верхнем углу блока
.big-picture, либо нажатием на клавишу Esc.
*/

var openPopup = function () {
    document.querySelector('body').classList.add('modal-open');
    bigPicture.classList.remove('hidden');
};

var closePopup = function () {
    document.querySelector('body').classList.remove('modal-open');
    bigPicture.classList.add('hidden');
};

var openUploadOverlay = function () {
    document.querySelector('body').classList.add('modal-open');
    uploadOverlay.classList.remove('hidden');
};
uploadFile.addEventListener('change', function () {
  openUploadOverlay();
});

var closeUploadOverlay = function () {
    document.querySelector('body').classList.remove('modal-open');
    uploadFile.value = '';
    uploadOverlay.classList.add('hidden');
};
uploadCloseButton.addEventListener('click', closeUploadOverlay);

var escUploadOverlay = function (evt) {
    if (evt.keyCode === KEYCODE_ESC) {
      document.querySelector('body').classList.remove('modal-open');
      uploadFile.value = '';
      uploadOverlay.classList.add('hidden');
    }
};
document.addEventListener('keydown', escUploadOverlay);


// ОБРАБОТЧИКИ
var buttonPopupCloseClickHandler = function (evt) {
  if (evt.target.className === 'big-picture__cancel cancel') closePopup();
};
bigPicture.addEventListener('click', buttonPopupCloseClickHandler);

var escGalleryKeydownHandler = function (evt) {
  if (evt.keyCode === KEYCODE_ESC) closePopup();
};
document.addEventListener('keydown', escGalleryKeydownHandler);

var picturePreviewClickHandler = function (evt) {
  // Q? Я правильно поняла Игоря, что слово Handler обязательно в названии обработчика?
  var target = evt.target;
  if (target.className === 'picture__img') {
    target = target.parentNode;
    var photoIndexNum = target.getAttribute("id").substr(6); // забираю число из id вида photo_00
    showBigPicture(photos[photoIndexNum]);
    openPopup();
  };
};
picturesSection.addEventListener('click', picturePreviewClickHandler);



var pinMouseupHandler = function () {
  console.log('Обработчик события mouseup');
};
uploadScalePin.addEventListener('mouseup', pinMouseupHandler);



// console.log();
