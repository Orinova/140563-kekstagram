'use strict';

(function () {
  var AVATAR_VARIANTS = 6;
  var ACTIVE_CLASS = 'img-filters__button--active';
  var INACTIVE_CLASS = 'img-filters--inactive';
  var DESCRIPTIONS = [
    'Тестим новую камеру!',
    'Затусили с друзьями на море',
    'Как же круто тут кормят',
    'Отдыхаем...',
    'Цените каждое мгновенье. Цените тех, кто рядом с вами и отгоняйте все сомненья. Не обижайте всех словами......',
    'Вот это тачка!'
  ];
  var picturesSection = document.querySelector('.pictures');
  var gallery = document.querySelector('.big-picture');
  var picturesData = []; // сюда запишем полученные с сервера данные

  var filtersBox = document.querySelector('.img-filters');
  var filterBtns = filtersBox.querySelectorAll('.img-filters__button');
  var filterActiveBtn = filtersBox.querySelector('.img-filters__button--active');

  // при клике на превью
  var onPhotoClick = function (evt) {
    var target = evt.target.parentNode;
    if (target.className === 'picture__link') {
      openGallery(target);
    }
  };
  picturesSection.addEventListener('click', onPhotoClick);

  var onPhotoEnter = function (evt) {
    var target = evt.target;
    if (window.utils.isEnterEvent(evt) && target.className === 'picture__link') {
      openGallery(target);
    }
  };
  picturesSection.addEventListener('keydown', onPhotoEnter);

  var renderGallery = function (photo) {
    var commentsList = gallery.querySelector('.social__comments'); // получили старый список комментариев (ul)
    var socialComment = gallery.querySelector('.social__comment').cloneNode(true); // скопировали
    socialComment.classList.add('social__comment--text'); // делаем шаблон для комментрия (li)
    commentsList.innerHTML = '';

    var fragment = document.createDocumentFragment();
    for (var i = 0; i < photo.comments.length; i++) {
      var comment = socialComment.cloneNode(true);
      comment.querySelector('.social__picture').src = 'img/avatar-' + window.utils.getRandomNum(1, AVATAR_VARIANTS) + '.svg';
      comment.querySelector('.social__text').textContent = photo.comments[i];
      fragment.appendChild(comment);
    }
    commentsList.appendChild(fragment);

    // Подставляем инфу в большую картинку
    gallery.querySelector('.big-picture__img img').src = photo.url;
    gallery.querySelector('.social__caption').textContent = DESCRIPTIONS[window.utils.getRandomNum(0, 5)]; // временно
    gallery.querySelector('.likes-count').textContent = photo.likes;
    gallery.querySelector('.comments-count').textContent = photo.comments.length;

    gallery.querySelector('.social__comment-count').classList.add('visually-hidden');
    gallery.querySelector('.social__loadmore').classList.add('visually-hidden');
  };

  var openGallery = function (target) {
    var index = target.getAttribute('id').substr(6); // забираем число из id
    renderGallery(picturesData[index]); // отрисовываем большую фотографию с таким id

    document.querySelector('body').classList.add('modal-open');
    gallery.classList.remove('hidden');
    document.addEventListener('keydown', galleryEscPress);

    var galleryCloseBtn = document.querySelector('.big-picture__cancel');
    galleryCloseBtn.addEventListener('click', closeGallery);
  };

  var closeGallery = function () {
    document.querySelector('body').classList.remove('modal-open');
    gallery.classList.add('hidden');
    document.removeEventListener('keydown', galleryEscPress); // выключаем
  };

  var galleryEscPress = function (evt) {
    if (window.utils.isEscEvent(evt)) {
      closeGallery();
    }
  };

  // ------------ Рендер превью
  // Создаем DOM элементы для переданного массива фотографий
  var createPhotoElement = function (index, photo) {
    var photoElement = document.querySelector('#picture').content.querySelector('.picture__link').cloneNode(true);
    photoElement.id = index;
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
      fragment.appendChild(createPhotoElement('photo_' + photos[i].id, photos[i]));
    }
    picturesSection.appendChild(fragment);
  };

  // --- Сортировки картинок

  var filterMethods = {
    'filter-popular': function () {
      return picturesData;
    },
    'filter-new': function () {
      var newPhotos = picturesData.slice(0, 10);
      newPhotos = window.utils.getShuffled(newPhotos);
      return newPhotos;
    },
    'filter-discussed': function (data) {
      return data.sort(function (a, b) {
        return b.comments.length - a.comments.length;
      });
    }
  };

  var clearPictures = function () {
    var photosList = picturesSection.querySelectorAll('.picture__link');
    photosList.forEach(function (item) {
      item.parentNode.removeChild(item);
    });
  };

  var switchFilter = function (evt) {
    var photos = picturesData.slice(0);
    var currentBtn = evt.target;
    var currentFilter = currentBtn.id;

    if (!currentBtn.classList.contains(ACTIVE_CLASS)) {
      photos = filterMethods[currentFilter](photos);

      filterActiveBtn.classList.remove(ACTIVE_CLASS);
      currentBtn.classList.add(ACTIVE_CLASS);
      filterActiveBtn = currentBtn;

      clearPictures();
      appendPictures(photos);
    }
  };

  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', window.utils.debounce(switchFilter));
  });

  // --- получаем данные с сервера
  var onSuccess = function (data) {
    picturesData = data;
    // при получении добавляю id в массив для открытия большого фото
    for (var i = 0; i < picturesData.length; i++) {
      picturesData[i].id = i;
    }
    appendPictures(picturesData);
    filtersBox.classList.remove(INACTIVE_CLASS);
  };

  var onError = function (message) {
    window.error.setMessage(message);
    window.error.show();
  };

  window.backend.download(onSuccess, onError);

})();
