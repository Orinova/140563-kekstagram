'use strict';

(function () {
  var AVATAR_VARIANTS = 6;
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


  // при клике на превью
  var onPhotoClick = function (evt) {
    var target = evt.target;
    if (target.className === 'picture__img') {
      target = target.parentNode; // определяем id выбранного фото, вида id="photo_0"
      var index = target.getAttribute('id').substr(6); // забираем число из id
      renderGallery(window.pictures.data[index]); // отрисовываем большую фотографию с таким id
      openGallery(); // открываем попап большой фотографии
    }
  };
  picturesSection.addEventListener('click', onPhotoClick);

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

    // Спрячьте блоки - это по заданию module3-task1, пятый пункт
    gallery.querySelector('.social__comment-count').classList.add('visually-hidden');
    gallery.querySelector('.social__loadmore').classList.add('visually-hidden');
  };

  var openGallery = function () {
    document.querySelector('body').classList.add('modal-open');
    gallery.classList.remove('hidden');
    document.addEventListener('keydown', galleryEscPress); // включаем отслеживание Esc

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
})();
