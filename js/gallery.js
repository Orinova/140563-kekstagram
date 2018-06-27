'use strict';
(function () {
  var picturesSection = document.querySelector('.pictures');
  var gallery = document.querySelector('.big-picture');

  // при клике на превью
  var onPhotoClick = function (evt) {
    var target = evt.target;
    if (target.className === 'picture__img') {
      target = target.parentNode; // определяем id выбранного фото, вида id="photo_0"
      var index = target.getAttribute('id').substr(6); // забираем число из id
      renderGallery(window.data[index]); // отрисовываем большую фотографию с таким id
      openGallery(); // открываем попап большой фотографии
    }
  };

  var renderGallery = function (photo) {
    var commentsList = gallery.querySelector('.social__comments'); // получили старый список комментариев (ul)
    var socialComment = gallery.querySelector('.social__comment').cloneNode(true); // скопировали
    socialComment.classList.add('social__comment--text'); // делаем шаблон для комментрия (li)
    commentsList.innerHTML = '';

    var fragment = document.createDocumentFragment();
    for (var i = 0; i < photo.comments.length; i++) {
      var comment = socialComment.cloneNode(true);
      comment.querySelector('.social__picture').src = photo.comments[i].avatar;
      comment.querySelector('.social__text').textContent = photo.comments[i].text;
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

  var openGallery = function () {
    document.querySelector('body').classList.add('modal-open');
    gallery.classList.remove('hidden');
  };

  var closeGallery = function () {
    document.querySelector('body').classList.remove('modal-open');
    gallery.classList.add('hidden');
  };

  var galleryEscPress = function (evt) {
    window.util.isEscEvent(evt, closeGallery);
  };

  picturesSection.addEventListener('click', onPhotoClick);

  var galleryCloseBtn = document.querySelector('.big-picture__cancel');
  galleryCloseBtn.addEventListener('click', closeGallery);

  document.addEventListener('keydown', galleryEscPress);
})();
