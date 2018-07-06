'use strict';

(function () {
  var Scale = {
    RANGE: 25,
    MIN: 25,
    MAX: 100,
    DEFAULT: 100
  };
  var uploadSection = document.querySelector('.img-upload');
  var uploadImgPreview = uploadSection.querySelector('.img-upload__preview');

  var resizeControls = uploadSection.querySelector('.resize');
  var resizePlus = resizeControls.querySelector('.resize__control--plus');
  var resizeMinus = resizeControls.querySelector('.resize__control--minus');
  var resizeValue = resizeControls.querySelector('.resize__control--value');

  var setScale = function (command) {
    var valueNum = resizeValue.value.slice(0, -1);
    if (command === 'plus' && valueNum < Scale.MAX) {
      valueNum = +valueNum + Scale.RANGE;
    }
    if (command === 'minus' && valueNum > Scale.MIN) {
      valueNum = +valueNum - Scale.RANGE;
    }
    if (command === 'reset') {
      valueNum = Scale.DEFAULT;
    }
    uploadImgPreview.style.transform = 'scale(' + valueNum / 100 + ')';
    resizeValue.setAttribute('value', valueNum + '%');
  };

  resizePlus.addEventListener('click', function () {
    setScale('plus');
  });
  resizeMinus.addEventListener('click', function () {
    setScale('minus');
  });

  var setDefault = function () {
    setScale('reset');
  };

  window.scale = {
    setDefault: setDefault
  };
})();
