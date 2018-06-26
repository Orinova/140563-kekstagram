'use strict';

var picturesSection = document.querySelector('.pictures');
var gallery = document.querySelector('.big-picture');
var galleryCloseBtn = document.querySelector('.big-picture__cancel');

var onPhotoClick = function (evt) {
  var target = evt.target;
  if (target.className === 'picture__img') {
    target = target.parentNode;
    var index = target.getAttribute('id').substr(6);
    showGallery(window.data[index]);
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
  if (evt.keyCode === KEYCODE_ESC && evt.target !== hashtagsInput && evt.target !== descriptionInput) {
    closeGallery();
  }
};
picturesSection.addEventListener('click', onPhotoClick);
galleryCloseBtn.addEventListener('click', closeGallery);
document.addEventListener('keydown', galleryEscPress);


////////////////////////////////////    picture.js    ////////////////////////////////////
//                                   Большая картинка                                    //
var showGallery = function (photo) {
  var commentsList = gallery.querySelector('.social__comments'); // список комментариев (ul)
  var socialComment = gallery.querySelector('.social__comment').cloneNode(true);
  socialComment.classList.add('social__comment--text'); // получили шаблон для комментрия (li)
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
