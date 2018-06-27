'use strict';

var KEYCODE_ESC = 27;

(function () {
  var isEscEvent = function (evt, action) {
    if (evt.keyCode === KEYCODE_ESC
        && evt.target.className !== 'text__hashtags'
        && evt.target.className !== 'text__description') {
      action();
    }
  };

  window.util = {
    isEscEvent: isEscEvent
  };
})();
