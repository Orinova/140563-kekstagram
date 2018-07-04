'use strict';

(function () {
  var ACTIVE_CLASS = 'img-filters__button--active';
  var INACTIVE_CLASS = 'img-filters--inactive';

  var filtersBox = document.querySelector('.img-filters');
  var filterBtns = filtersBox.querySelectorAll('.img-filters__button');
  var filterActiveBtn = filtersBox.querySelector('.img-filters__button--active');

  var picturesSection = document.querySelector('.pictures');
  var picturesData = [];

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

  // !!! Повторяющийся кусок от gallery.js
  var onSuccess = function (data) {
    picturesData = data;
    for (var i = 0; i < picturesData.length; i++) {
      picturesData[i].id = i;
    }
    filtersBox.classList.remove(INACTIVE_CLASS);
  };
  window.backend.download(onSuccess);

  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function (evt) {
      var photos = picturesData.slice(0);
      var currentBtn = evt.target;
      var currentFilter = currentBtn.id;

      if (!currentBtn.classList.contains(ACTIVE_CLASS)) {
        photos = filterMethods[currentFilter](photos);

        filterActiveBtn.classList.remove(ACTIVE_CLASS);
        currentBtn.classList.add(ACTIVE_CLASS);
        filterActiveBtn = currentBtn;

        // Зачистка предыдущих фото:
        var photosListItemElement = picturesSection.querySelectorAll('.picture__link');
        photosListItemElement.forEach(function (item) {
          item.parentNode.removeChild(item);
        });

        window.gallery.append(photos);
      }
    });
  });

})();
