'use strict';

(function () {
  var UPLOAD_URL = 'https://js.dump.academy/kekstagram';
  var DOWNLOAD_URL = UPLOAD_URL + '/data';
  var TIMEOUT = 10000;
  var SUCCESS_CODE = 200;

  var createXHR = function (onLoad, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      if (xhr.status === SUCCESS_CODE) {
        onLoad(xhr.response);
      } else {
        onError('Статус ответа: ' + xhr.status + ' ' + xhr.statusText);
      }
    });
    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });
    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });

    xhr.timeout = TIMEOUT;
    return xhr;
  };

  var download = function (onLoad, onError) {
    var xhr = createXHR(onLoad, onError);
    xhr.open('GET', DOWNLOAD_URL);
    xhr.send();
  };

  var upload = function (data, onLoad, onError) {
    var xhr = createXHR(onLoad, onError);
    xhr.open('POST', UPLOAD_URL);
    xhr.send(data);
  };

  window.backend = {
    download: download,
    upload: upload
  };
})();
