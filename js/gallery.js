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
  var PHOTO_PREFIX = 'photo_';
  var NEW_PHOTO_QUANTITY = 10;
  var LOAD_STEP = 5; // сколько комментариев в одной подгрузке
  var commentsOnPage = 0; // счетчик открытых комментариев на странице
  var showedPhoto = 0; // при открытии запишем index просматриваемого фото

  var picturesSection = document.querySelector('.pictures');
  var gallery = document.querySelector('.big-picture');
  var picturesData = []; // сюда запишем полученные с сервера данные

  var filtersBox = document.querySelector('.img-filters');
  var filterBtns = filtersBox.querySelectorAll('.img-filters__button');
  var filterActiveBtn = filtersBox.querySelector('.img-filters__button--active');

  var loadmoreBtn = document.querySelector('.social__loadmore');
  var commentsNum = document.querySelector('.comments-num');
  var commentsCount = document.querySelector('.comments-count');

  // Получение и настройка шаблона комментария
  var commentsList = gallery.querySelector('.social__comments'); // получили старый список комментариев (ul)
  var socialComment = gallery.querySelector('.social__comment').cloneNode(true); // скопировали
  socialComment.classList.add('social__comment--text'); // шаблон для комментрия


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

  var setPhoto = function (photo) {
    var descriptionVariants = DESCRIPTIONS.length - 1;
    gallery.querySelector('.big-picture__img img').src = photo.url;
    gallery.querySelector('.social__caption').textContent = DESCRIPTIONS[window.utils.getRandomNum(0, descriptionVariants)];
    gallery.querySelector('.likes-count').textContent = photo.likes;
    commentsList.innerHTML = '';
    addComments(photo);
    commentsCount.textContent = photo.comments.length;
  };

  var openGallery = function (target) {
    showedPhoto = target.getAttribute('id').substr(PHOTO_PREFIX.length);
    setPhoto(picturesData[showedPhoto]);
    document.querySelector('body').classList.add('modal-open');
    gallery.classList.remove('hidden');
    document.addEventListener('keydown', onGalleryEscPress);

    var galleryCloseBtn = document.querySelector('.big-picture__cancel');
    galleryCloseBtn.addEventListener('click', function () {
      closeGallery();
    });
  };

  var closeGallery = function () {
    document.querySelector('body').classList.remove('modal-open');
    gallery.classList.add('hidden');
    document.removeEventListener('keydown', onGalleryEscPress); // выключаем
    commentsOnPage = 0;
  };

  var onGalleryEscPress = function (evt) {
    if (window.utils.isEscEvent(evt)) {
      closeGallery();
    }
  };


  // ------------ Рендер превью
  // Создаем DOM элементы для переданного массива фотографий
  var createPhoto = function (index, photo) {
    var photoCard = document.querySelector('#picture').content.querySelector('.picture__link').cloneNode(true);
    photoCard.id = index;
    photoCard.querySelector('.picture__img').alt = photo.description;
    photoCard.querySelector('.picture__img').src = photo.url;
    photoCard.querySelector('.picture__stat--likes').textContent = photo.likes;
    photoCard.querySelector('.picture__stat--comments').textContent = photo.comments.length;
    return photoCard;
  };

  // Заполянем блок на странице созданными DOM-элементами (превью фотографий)
  var appendPictures = function (photos) {
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < photos.length; i++) {
      fragment.appendChild(createPhoto(PHOTO_PREFIX + photos[i].id, photos[i]));
    }
    picturesSection.appendChild(fragment);
  };


  // ------------ Сортировки картинок

  var filterMethods = {
    'filter-popular': function () {
      return picturesData;
    },
    'filter-new': function () {
      var newPhotos = picturesData.slice(0, NEW_PHOTO_QUANTITY);
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


  // ------------ Функция добавления комментариев
  var addComments = function (photo) {
    var fragment = document.createDocumentFragment();

    // начинаем обход с последнего комментария на странице (commentsOnPage) до конца массива,
    // если количество итераций >= LOAD_STEP (пять раз по ТЗ) - прекращаем цикл
    for (var i = commentsOnPage; i < photo.comments.length; i++) {
      if (i - commentsOnPage >= LOAD_STEP) {
        break;
      }
      var comment = socialComment.cloneNode(true);
      comment.querySelector('.social__picture').src = 'img/avatar-' + window.utils.getRandomNum(1, AVATAR_VARIANTS) + '.svg';
      comment.querySelector('.social__text').textContent = photo.comments[i];
      fragment.appendChild(comment);
    }
    commentsOnPage = i;
    commentsList.appendChild(fragment);
    commentsNum.textContent = commentsOnPage;

    if (commentsOnPage === photo.comments.length) {
      loadmoreBtn.classList.add('hidden');
    } else {
      loadmoreBtn.classList.remove('hidden');
    }
  };
  loadmoreBtn.addEventListener('click', function () {
    addComments(picturesData[showedPhoto]);
  });

  // ------------ получаем данные с сервера
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
