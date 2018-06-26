'use strict';

(function () {
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
  var appendPictures = function (photos) {
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < photos.length; i++) {
      fragment.appendChild(createPhotoElement('photo_' + i, photos[i]));
    }
    picturesSection.appendChild(fragment);
  };
  // вывели их на страницу
  appendPictures(window.data);
})();
