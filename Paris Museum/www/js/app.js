// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
window.Media = function(src, mediaSuccess, mediaError, mediaStatus){
  // src: A URI containing the audio content. (DOMString)
  // mediaSuccess: (Optional) The callback that executes after a Media object has completed the current play, record, or stop action. (Function)
  // mediaError: (Optional) The callback that executes if an error occurs. (Function)
  // mediaStatus: (Optional) The callback that executes to indicate status changes. (Function)

  if (typeof Audio !== "function" && typeof Audio !== "object") {
    console.warn("HTML5 Audio is not supported in this browser");
  }
  var sound = new Audio();
  sound.src = src;
  sound.addEventListener("ended", mediaSuccess, false);
  sound.load();

  return {
    // Returns the current position within an audio file (in seconds).
    getCurrentPosition: function(mediaSuccess, mediaError){ mediaSuccess(sound.currentTime); },
    // Returns the duration of an audio file (in seconds) or -1.
    getDuration: function(){ return isNaN(sound.duration) ? -1 : sound.duration; },
    // Start or resume playing an audio file.
    play: function(){ sound.play(); },
    // Pause playback of an audio file.
    pause: function(){ sound.pause(); },
    // Releases the underlying operating system's audio resources. Should be called on a ressource when it's no longer needed !
    release: function(){},
    // Moves the position within the audio file.
    seekTo: function(milliseconds){}, // TODO
    // Set the volume for audio playback (between 0.0 and 1.0).
    setVolume: function(volume){ sound.volume = volume; },
    // Start recording an audio file.
    startRecord: function(){},
    // Stop recording an audio file.
    stopRecord: function(){},
    // Stop playing an audio file.
    stop: function(){ sound.pause(); if(mediaSuccess){mediaSuccess();} } // TODO
  };
};

angular.module('starter', ['ionic', 'starter.controllers', 'ngCordova', 'angular-gestures', 'ngTouch'])

.run(function($ionicPlatform, $state, $rootScope, $cordovaStatusbar) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      //alert('shit');
      // org.apache.cordova.statusbar required
      //StatusBar.styleDefault();
      //$cordovaStatusbar.overlaysWebView(true);
      //$cordovawindow.Statusbar.styleHex('#31C3F6');
      //$cordovaStatusbar.hide();
      StatusBar.backgroundColorByHexString("#31C3F6");
    
    }
  });
})
.directive('backImg', function(){
    return function(scope, element, attrs){
        var url = attrs.backImg;
        element.css({
            'background-image': 'url(' + url +')'
        });
    };
})
.directive('myRepeatDirective', function() {
  return function(scope, element, attrs) {

    w = window,
    d = document,
    e = d.documentElement,
    g = d.getElementsByTagName('body')[0],
    x = w.innerWidth || e.clientWidth || g.clientWidth,
    y = w.innerHeight|| e.clientHeight|| g.clientHeight;
    var height = (y - 44)/3 + 'px';
    //alert(height);
    console.log(scope);
    angular.element(element).css('height', (y - 44)/3 + 'px');

  };
})

.factory('MediaSrv', function($q, $ionicPlatform, $window) {
  var service = {
    loadMedia: loadMedia,
    getStatusMessage: getStatusMessage,
    getErrorMessage: getErrorMessage
  };

  function loadMedia(src, onError, onStatus, onStop) {
    var defer = $q.defer();
    $ionicPlatform.ready(function() {
      var mediaSuccess = function() {
        if (onStop) {
          onStop();
        }
      };
      var mediaError = function(err) {
        _logError(src, err);
        if (onError) {
          onError(err);
        }
      };
      var mediaStatus = function(status) {
        if (onStatus) {
          onStatus(status);
        }
      };

      if ($ionicPlatform.is('android')) {
        src = '/android_asset/www/' + src;
      }
      defer.resolve(new $window.Media(src, mediaSuccess, mediaError, mediaStatus));
    });
    return defer.promise;
  }

  function _logError(src, err) {
    console.error('media error', {
      code: err.code,
      message: getErrorMessage(err.code)
    });
  }

  function getStatusMessage(status) {
    if (status === 0) {
      return 'Media.MEDIA_NONE';
    } else if (status === 1) {
      return 'Media.MEDIA_STARTING';
    } else if (status === 2) {
      return 'Media.MEDIA_RUNNING';
    } else if (status === 3) {
      return 'Media.MEDIA_PAUSED';
    } else if (status === 4) {
      return 'Media.MEDIA_STOPPED';
    } else {
      return 'Unknown status <' + status + '>';
    }
  }

  function getErrorMessage(code) {
    if (code === 1) {
      return 'MediaError.MEDIA_ERR_ABORTED';
    } else if (code === 2) {
      return 'MediaError.MEDIA_ERR_NETWORK';
    } else if (code === 3) {
      return 'MediaError.MEDIA_ERR_DECODE';
    } else if (code === 4) {
      return 'MediaError.MEDIA_ERR_NONE_SUPPORTED';
    } else {
      return 'Unknown code <' + code + '>';
    }
  }

  return service;
})


.service('ObjectsService', function($q) {
  return {
    objects: [
      { id: 1, name: '蒙娜丽莎', frenchname:'Mona Lisa', img: 'img/big/monalisa@2x.png', museumid: 1, imgsmall: 'img/big/object-example.png', introbackground: 'img/big/intro-background-monalisa@2x.png', description:'《蒙娜丽莎》是一幅享有盛誉的肖像画杰作。它代表达·芬奇的最高艺术成就，成功地塑造了资本主义上升时期一位城市有产阶级的妇女形象。画中人物坐姿优雅，笑容微妙，背景山水幽深茫茫，淋漓尽致地发挥了画家那奇特的烟雾状“无界渐变着色法”般的笔法。画家力图使人物的丰富内心感情和美丽的外形达到巧妙的结合，对于人像面容中眼角唇边等表露感情的关键部位，也特别着重掌握精确与含蓄的辩证关系，达到神韵之境，从而使蒙娜丽莎的微笑具有一种神秘莫测的千古奇韵，那如梦似的妩媚微笑，被不少美术史家称为“神秘的微笑”。', audio:'audio/test/Evergreen\ Tree-Cliff\ Richard.mp3'},
      { id: 2, name: '米洛岛的维纳斯', frenchname:'Vénus de Milo', img: 'img/big/monalisa@2x.png', museumid: 1, imgsmall: 'img/big/object-example.png', introbackground: 'img/big/intro-background-monalisa@2x.png', description:'《蒙娜丽莎》是一幅享有盛誉的肖像画杰作。它代表达·芬奇的最高艺术成就，成功地塑造了资本主义上升时期一位城市有产阶级的妇女形象。画中人物坐姿优雅，笑容微妙，背景山水幽深茫茫，淋漓尽致地发挥了画家那奇特的烟雾状“无界渐变着色法”般的笔法。画家力图使人物的丰富内心感情和美丽的外形达到巧妙的结合，对于人像面容中眼角唇边等表露感情的关键部位，也特别着重掌握精确与含蓄的辩证关系，达到神韵之境，从而使蒙娜丽莎的微笑具有一种神秘莫测的千古奇韵，那如梦似的妩媚微笑，被不少美术史家称为“神秘的微笑”。', audio:'audio/test/minion_ring_ring.mp3'},
      { id: 3, name: '萨莫色雷斯的胜利女神', frenchname:'La Victoire de Samothrace', img: 'img/big/monalisa@2x.png', museumid: 1, imgsmall: 'img/big/object-example.png', introbackground: 'img/big/intro-background-monalisa@2x.png', description:'《蒙娜丽莎》是一幅享有盛誉的肖像画杰作。它代表达·芬奇的最高艺术成就，成功地塑造了资本主义上升时期一位城市有产阶级的妇女形象。画中人物坐姿优雅，笑容微妙，背景山水幽深茫茫，淋漓尽致地发挥了画家那奇特的烟雾状“无界渐变着色法”般的笔法。画家力图使人物的丰富内心感情和美丽的外形达到巧妙的结合，对于人像面容中眼角唇边等表露感情的关键部位，也特别着重掌握精确与含蓄的辩证关系，达到神韵之境，从而使蒙娜丽莎的微笑具有一种神秘莫测的千古奇韵，那如梦似的妩媚微笑，被不少美术史家称为“神秘的微笑”。', audio:'audio/test/minion_ring_ring.mp3'},
      { id: 4, name: '荷拉斯兄弟之誓', frenchname:'Le Serment des Horaces', img: 'img/big/monalisa@2x.png', museumid: 1, imgsmall: 'img/big/object-example.png', introbackground: 'img/big/intro-background-monalisa@2x.png', description:'《蒙娜丽莎》是一幅享有盛誉的肖像画杰作。它代表达·芬奇的最高艺术成就，成功地塑造了资本主义上升时期一位城市有产阶级的妇女形象。画中人物坐姿优雅，笑容微妙，背景山水幽深茫茫，淋漓尽致地发挥了画家那奇特的烟雾状“无界渐变着色法”般的笔法。画家力图使人物的丰富内心感情和美丽的外形达到巧妙的结合，对于人像面容中眼角唇边等表露感情的关键部位，也特别着重掌握精确与含蓄的辩证关系，达到神韵之境，从而使蒙娜丽莎的微笑具有一种神秘莫测的千古奇韵，那如梦似的妩媚微笑，被不少美术史家称为“神秘的微笑”。', audio:'audio/test/minion_ring_ring.mp3'},
      { id: 5, name: '拿破仑一世与约瑟芬皇后加冕礼', frenchname:'', img: 'img/big/monalisa@2x.png', museumid: 1, imgsmall: 'img/big/object-example.png', introbackground: 'img/big/intro-background-monalisa@2x.png', description:'《蒙娜丽莎》是一幅享有盛誉的肖像画杰作。它代表达·芬奇的最高艺术成就，成功地塑造了资本主义上升时期一位城市有产阶级的妇女形象。画中人物坐姿优雅，笑容微妙，背景山水幽深茫茫，淋漓尽致地发挥了画家那奇特的烟雾状“无界渐变着色法”般的笔法。画家力图使人物的丰富内心感情和美丽的外形达到巧妙的结合，对于人像面容中眼角唇边等表露感情的关键部位，也特别着重掌握精确与含蓄的辩证关系，达到神韵之境，从而使蒙娜丽莎的微笑具有一种神秘莫测的千古奇韵，那如梦似的妩媚微笑，被不少美术史家称为“神秘的微笑”。', audio:'audio/test/minion_ring_ring.mp3'},
      { id: 6, name: '大宫女', frenchname:'La Grande Odalisque', img: 'img/big/monalisa@2x.png', museumid: 1, imgsmall: 'img/big/object-example.png', introbackground: 'img/big/intro-background-monalisa@2x.png', description:'《蒙娜丽莎》是一幅享有盛誉的肖像画杰作。它代表达·芬奇的最高艺术成就，成功地塑造了资本主义上升时期一位城市有产阶级的妇女形象。画中人物坐姿优雅，笑容微妙，背景山水幽深茫茫，淋漓尽致地发挥了画家那奇特的烟雾状“无界渐变着色法”般的笔法。画家力图使人物的丰富内心感情和美丽的外形达到巧妙的结合，对于人像面容中眼角唇边等表露感情的关键部位，也特别着重掌握精确与含蓄的辩证关系，达到神韵之境，从而使蒙娜丽莎的微笑具有一种神秘莫测的千古奇韵，那如梦似的妩媚微笑，被不少美术史家称为“神秘的微笑”。', audio:'audio/test/minion_ring_ring.mp3'},
      { id: 7, name: '加纳的婚礼', frenchname:'Les Noces de Cana', img: 'img/big/monalisa@2x.png', museumid: 1, imgsmall: 'img/big/object-example.png', introbackground: 'img/big/intro-background-monalisa@2x.png', description:'《蒙娜丽莎》是一幅享有盛誉的肖像画杰作。它代表达·芬奇的最高艺术成就，成功地塑造了资本主义上升时期一位城市有产阶级的妇女形象。画中人物坐姿优雅，笑容微妙，背景山水幽深茫茫，淋漓尽致地发挥了画家那奇特的烟雾状“无界渐变着色法”般的笔法。画家力图使人物的丰富内心感情和美丽的外形达到巧妙的结合，对于人像面容中眼角唇边等表露感情的关键部位，也特别着重掌握精确与含蓄的辩证关系，达到神韵之境，从而使蒙娜丽莎的微笑具有一种神秘莫测的千古奇韵，那如梦似的妩媚微笑，被不少美术史家称为“神秘的微笑”。', audio:'audio/test/minion_ring_ring.mp3'},
      { id: 8, name: '奥赛展品示例1', frenchname:'Orsay example 1', img: 'img/big/monalisa@2x.png', museumid: 2, imgsmall: 'img/big/object-example.png', introbackground: 'img/big/intro-background-monalisa@2x.png', description:'《蒙娜丽莎》是一幅享有盛誉的肖像画杰作。它代表达·芬奇的最高艺术成就，成功地塑造了资本主义上升时期一位城市有产阶级的妇女形象。画中人物坐姿优雅，笑容微妙，背景山水幽深茫茫，淋漓尽致地发挥了画家那奇特的烟雾状“无界渐变着色法”般的笔法。画家力图使人物的丰富内心感情和美丽的外形达到巧妙的结合，对于人像面容中眼角唇边等表露感情的关键部位，也特别着重掌握精确与含蓄的辩证关系，达到神韵之境，从而使蒙娜丽莎的微笑具有一种神秘莫测的千古奇韵，那如梦似的妩媚微笑，被不少美术史家称为“神秘的微笑”。', audio:'audio/test/minion_ring_ring.mp3'},
      { id: 9, name: '奥赛展品示例2', frenchname:'Orsay example 2', img: 'img/big/monalisa@2x.png', museumid: 2, imgsmall: 'img/big/object-example.png', introbackground: 'img/big/intro-background-monalisa@2x.png', description:'《蒙娜丽莎》是一幅享有盛誉的肖像画杰作。它代表达·芬奇的最高艺术成就，成功地塑造了资本主义上升时期一位城市有产阶级的妇女形象。画中人物坐姿优雅，笑容微妙，背景山水幽深茫茫，淋漓尽致地发挥了画家那奇特的烟雾状“无界渐变着色法”般的笔法。画家力图使人物的丰富内心感情和美丽的外形达到巧妙的结合，对于人像面容中眼角唇边等表露感情的关键部位，也特别着重掌握精确与含蓄的辩证关系，达到神韵之境，从而使蒙娜丽莎的微笑具有一种神秘莫测的千古奇韵，那如梦似的妩媚微笑，被不少美术史家称为“神秘的微笑”。', audio:'audio/test/minion_ring_ring.mp3'},
      { id: 10, name: '奥赛展品示例3', frenchname:'Orsay example 3', img: 'img/big/monalisa@2x.png', museumid: 2, imgsmall: 'img/big/object-example.png', introbackground: 'img/big/intro-background-monalisa@2x.png', description:'《蒙娜丽莎》是一幅享有盛誉的肖像画杰作。它代表达·芬奇的最高艺术成就，成功地塑造了资本主义上升时期一位城市有产阶级的妇女形象。画中人物坐姿优雅，笑容微妙，背景山水幽深茫茫，淋漓尽致地发挥了画家那奇特的烟雾状“无界渐变着色法”般的笔法。画家力图使人物的丰富内心感情和美丽的外形达到巧妙的结合，对于人像面容中眼角唇边等表露感情的关键部位，也特别着重掌握精确与含蓄的辩证关系，达到神韵之境，从而使蒙娜丽莎的微笑具有一种神秘莫测的千古奇韵，那如梦似的妩媚微笑，被不少美术史家称为“神秘的微笑”。', audio:'audio/test/minion_ring_ring.mp3'},
      { id: 11, name: '奥赛展品示例4', frenchname:'Orsay example 4', img: 'img/big/monalisa@2x.png', museumid: 2, imgsmall: 'img/big/object-example.png', introbackground: 'img/big/intro-background-monalisa@2x.png', description:'《蒙娜丽莎》是一幅享有盛誉的肖像画杰作。它代表达·芬奇的最高艺术成就，成功地塑造了资本主义上升时期一位城市有产阶级的妇女形象。画中人物坐姿优雅，笑容微妙，背景山水幽深茫茫，淋漓尽致地发挥了画家那奇特的烟雾状“无界渐变着色法”般的笔法。画家力图使人物的丰富内心感情和美丽的外形达到巧妙的结合，对于人像面容中眼角唇边等表露感情的关键部位，也特别着重掌握精确与含蓄的辩证关系，达到神韵之境，从而使蒙娜丽莎的微笑具有一种神秘莫测的千古奇韵，那如梦似的妩媚微笑，被不少美术史家称为“神秘的微笑”。', audio:'audio/test/minion_ring_ring.mp3'},
      { id: 12, name: '奥赛展品示例5', frenchname:'Orsay example 5', img: 'img/big/monalisa@2x.png', museumid: 2, imgsmall: 'img/big/object-example.png', introbackground: 'img/big/intro-background-monalisa@2x.png', description:'《蒙娜丽莎》是一幅享有盛誉的肖像画杰作。它代表达·芬奇的最高艺术成就，成功地塑造了资本主义上升时期一位城市有产阶级的妇女形象。画中人物坐姿优雅，笑容微妙，背景山水幽深茫茫，淋漓尽致地发挥了画家那奇特的烟雾状“无界渐变着色法”般的笔法。画家力图使人物的丰富内心感情和美丽的外形达到巧妙的结合，对于人像面容中眼角唇边等表露感情的关键部位，也特别着重掌握精确与含蓄的辩证关系，达到神韵之境，从而使蒙娜丽莎的微笑具有一种神秘莫测的千古奇韵，那如梦似的妩媚微笑，被不少美术史家称为“神秘的微笑”。', audio:'audio/test/minion_ring_ring.mp3'},
      { id: 13, name: '奥塞尔女郎', frenchname:'Dame d\'Auxerre', img: 'img/big/monalisa@2x.png', museumid: 1, imgsmall: 'img/big/object-example.png', introbackground: 'img/big/intro-background-monalisa@2x.png', description:'《蒙娜丽莎》是一幅享有盛誉的肖像画杰作。它代表达·芬奇的最高艺术成就，成功地塑造了资本主义上升时期一位城市有产阶级的妇女形象。画中人物坐姿优雅，笑容微妙，背景山水幽深茫茫，淋漓尽致地发挥了画家那奇特的烟雾状“无界渐变着色法”般的笔法。画家力图使人物的丰富内心感情和美丽的外形达到巧妙的结合，对于人像面容中眼角唇边等表露感情的关键部位，也特别着重掌握精确与含蓄的辩证关系，达到神韵之境，从而使蒙娜丽莎的微笑具有一种神秘莫测的千古奇韵，那如梦似的妩媚微笑，被不少美术史家称为“神秘的微笑”。', audio:'audio/test/minion_ring_ring.mp3'},
      { id: 14, name: '让柏的骑士', frenchname:'Cavalier Rampin', img: 'img/big/monalisa@2x.png', museumid: 1, imgsmall: 'img/big/object-example.png', introbackground: 'img/big/intro-background-monalisa@2x.png', description:'《蒙娜丽莎》是一幅享有盛誉的肖像画杰作。它代表达·芬奇的最高艺术成就，成功地塑造了资本主义上升时期一位城市有产阶级的妇女形象。画中人物坐姿优雅，笑容微妙，背景山水幽深茫茫，淋漓尽致地发挥了画家那奇特的烟雾状“无界渐变着色法”般的笔法。画家力图使人物的丰富内心感情和美丽的外形达到巧妙的结合，对于人像面容中眼角唇边等表露感情的关键部位，也特别着重掌握精确与含蓄的辩证关系，达到神韵之境，从而使蒙娜丽莎的微笑具有一种神秘莫测的千古奇韵，那如梦似的妩媚微笑，被不少美术史家称为“神秘的微笑”。', audio:'audio/test/minion_ring_ring.mp3'},
      { id: 15, name: '拉伯德的头像', frenchname:'Tête Laborde', img: 'img/big/monalisa@2x.png', museumid: 1, imgsmall: 'img/big/object-example.png', introbackground: 'img/big/intro-background-monalisa@2x.png', description:'《蒙娜丽莎》是一幅享有盛誉的肖像画杰作。它代表达·芬奇的最高艺术成就，成功地塑造了资本主义上升时期一位城市有产阶级的妇女形象。画中人物坐姿优雅，笑容微妙，背景山水幽深茫茫，淋漓尽致地发挥了画家那奇特的烟雾状“无界渐变着色法”般的笔法。画家力图使人物的丰富内心感情和美丽的外形达到巧妙的结合，对于人像面容中眼角唇边等表露感情的关键部位，也特别着重掌握精确与含蓄的辩证关系，达到神韵之境，从而使蒙娜丽莎的微笑具有一种神秘莫测的千古奇韵，那如梦似的妩媚微笑，被不少美术史家称为“神秘的微笑”。', audio:'audio/test/minion_ring_ring.mp3'},
      { id: 16, name: '克尼德的阿弗洛狄忒', frenchname:'Aphrodite de Cnide', img: 'img/big/monalisa@2x.png', museumid: 1, imgsmall: 'img/big/object-example.png', introbackground: 'img/big/intro-background-monalisa@2x.png', description:'《蒙娜丽莎》是一幅享有盛誉的肖像画杰作。它代表达·芬奇的最高艺术成就，成功地塑造了资本主义上升时期一位城市有产阶级的妇女形象。画中人物坐姿优雅，笑容微妙，背景山水幽深茫茫，淋漓尽致地发挥了画家那奇特的烟雾状“无界渐变着色法”般的笔法。画家力图使人物的丰富内心感情和美丽的外形达到巧妙的结合，对于人像面容中眼角唇边等表露感情的关键部位，也特别着重掌握精确与含蓄的辩证关系，达到神韵之境，从而使蒙娜丽莎的微笑具有一种神秘莫测的千古奇韵，那如梦似的妩媚微笑，被不少美术史家称为“神秘的微笑”。', audio:'audio/test/minion_ring_ring.mp3'},
      { id: 17, name: '奥赛展品示例6', frenchname:'Orsay example 6', img: 'img/big/monalisa@2x.png', museumid: 2, imgsmall: 'img/big/object-example.png', introbackground: 'img/big/intro-background-monalisa@2x.png', description:'《蒙娜丽莎》是一幅享有盛誉的肖像画杰作。它代表达·芬奇的最高艺术成就，成功地塑造了资本主义上升时期一位城市有产阶级的妇女形象。画中人物坐姿优雅，笑容微妙，背景山水幽深茫茫，淋漓尽致地发挥了画家那奇特的烟雾状“无界渐变着色法”般的笔法。画家力图使人物的丰富内心感情和美丽的外形达到巧妙的结合，对于人像面容中眼角唇边等表露感情的关键部位，也特别着重掌握精确与含蓄的辩证关系，达到神韵之境，从而使蒙娜丽莎的微笑具有一种神秘莫测的千古奇韵，那如梦似的妩媚微笑，被不少美术史家称为“神秘的微笑”。', audio:'audio/test/minion_ring_ring.mp3'},
      { id: 18, name: '奥赛展品示例7', frenchname:'Orsay example 7', img: 'img/big/monalisa@2x.png', museumid: 2, imgsmall: 'img/big/object-example.png', introbackground: 'img/big/intro-background-monalisa@2x.png', description:'《蒙娜丽莎》是一幅享有盛誉的肖像画杰作。它代表达·芬奇的最高艺术成就，成功地塑造了资本主义上升时期一位城市有产阶级的妇女形象。画中人物坐姿优雅，笑容微妙，背景山水幽深茫茫，淋漓尽致地发挥了画家那奇特的烟雾状“无界渐变着色法”般的笔法。画家力图使人物的丰富内心感情和美丽的外形达到巧妙的结合，对于人像面容中眼角唇边等表露感情的关键部位，也特别着重掌握精确与含蓄的辩证关系，达到神韵之境，从而使蒙娜丽莎的微笑具有一种神秘莫测的千古奇韵，那如梦似的妩媚微笑，被不少美术史家称为“神秘的微笑”。', audio:'audio/test/minion_ring_ring.mp3'},
      { id: 19, name: '奥赛展品示例8', frenchname:'Orsay example 8', img: 'img/big/monalisa@2x.png', museumid: 2, imgsmall: 'img/big/object-example.png', introbackground: 'img/big/intro-background-monalisa@2x.png', description:'《蒙娜丽莎》是一幅享有盛誉的肖像画杰作。它代表达·芬奇的最高艺术成就，成功地塑造了资本主义上升时期一位城市有产阶级的妇女形象。画中人物坐姿优雅，笑容微妙，背景山水幽深茫茫，淋漓尽致地发挥了画家那奇特的烟雾状“无界渐变着色法”般的笔法。画家力图使人物的丰富内心感情和美丽的外形达到巧妙的结合，对于人像面容中眼角唇边等表露感情的关键部位，也特别着重掌握精确与含蓄的辩证关系，达到神韵之境，从而使蒙娜丽莎的微笑具有一种神秘莫测的千古奇韵，那如梦似的妩媚微笑，被不少美术史家称为“神秘的微笑”。', audio:'audio/test/minion_ring_ring.mp3'},
      { id: 20, name: '奥赛展品示例9', frenchname:'Orsay example 9', img: 'img/big/monalisa@2x.png', museumid: 2, imgsmall: 'img/big/object-example.png', introbackground: 'img/big/intro-background-monalisa@2x.png', description:'《蒙娜丽莎》是一幅享有盛誉的肖像画杰作。它代表达·芬奇的最高艺术成就，成功地塑造了资本主义上升时期一位城市有产阶级的妇女形象。画中人物坐姿优雅，笑容微妙，背景山水幽深茫茫，淋漓尽致地发挥了画家那奇特的烟雾状“无界渐变着色法”般的笔法。画家力图使人物的丰富内心感情和美丽的外形达到巧妙的结合，对于人像面容中眼角唇边等表露感情的关键部位，也特别着重掌握精确与含蓄的辩证关系，达到神韵之境，从而使蒙娜丽莎的微笑具有一种神秘莫测的千古奇韵，那如梦似的妩媚微笑，被不少美术史家称为“神秘的微笑”。', audio:'audio/test/minion_ring_ring.mp3'},
      { id: 21, name: '奥赛展品示例10', frenchname:'Orsay example 10', img: 'img/big/monalisa@2x.png', museumid: 2, imgsmall: 'img/big/object-example.png', introbackground: 'img/big/intro-background-monalisa@2x.png', description:'《蒙娜丽莎》是一幅享有盛誉的肖像画杰作。它代表达·芬奇的最高艺术成就，成功地塑造了资本主义上升时期一位城市有产阶级的妇女形象。画中人物坐姿优雅，笑容微妙，背景山水幽深茫茫，淋漓尽致地发挥了画家那奇特的烟雾状“无界渐变着色法”般的笔法。画家力图使人物的丰富内心感情和美丽的外形达到巧妙的结合，对于人像面容中眼角唇边等表露感情的关键部位，也特别着重掌握精确与含蓄的辩证关系，达到神韵之境，从而使蒙娜丽莎的微笑具有一种神秘莫测的千古奇韵，那如梦似的妩媚微笑，被不少美术史家称为“神秘的微笑”。', audio:'audio/test/minion_ring_ring.mp3'},
      { id: 22, name: '蓬皮杜展品示例1', frenchname:'Pompidou example 1', img: 'img/big/monalisa@2x.png', museumid: 3, imgsmall: 'img/big/object-example.png', introbackground: 'img/big/intro-background-monalisa@2x.png', description:'《蒙娜丽莎》是一幅享有盛誉的肖像画杰作。它代表达·芬奇的最高艺术成就，成功地塑造了资本主义上升时期一位城市有产阶级的妇女形象。画中人物坐姿优雅，笑容微妙，背景山水幽深茫茫，淋漓尽致地发挥了画家那奇特的烟雾状“无界渐变着色法”般的笔法。画家力图使人物的丰富内心感情和美丽的外形达到巧妙的结合，对于人像面容中眼角唇边等表露感情的关键部位，也特别着重掌握精确与含蓄的辩证关系，达到神韵之境，从而使蒙娜丽莎的微笑具有一种神秘莫测的千古奇韵，那如梦似的妩媚微笑，被不少美术史家称为“神秘的微笑”。', audio:'audio/test/minion_ring_ring.mp3'},
      { id: 23, name: '蓬皮杜展品示例2', frenchname:'Pompidou example 2', img: 'img/big/monalisa@2x.png', museumid: 3, imgsmall: 'img/big/object-example.png', introbackground: 'img/big/intro-background-monalisa@2x.png', description:'《蒙娜丽莎》是一幅享有盛誉的肖像画杰作。它代表达·芬奇的最高艺术成就，成功地塑造了资本主义上升时期一位城市有产阶级的妇女形象。画中人物坐姿优雅，笑容微妙，背景山水幽深茫茫，淋漓尽致地发挥了画家那奇特的烟雾状“无界渐变着色法”般的笔法。画家力图使人物的丰富内心感情和美丽的外形达到巧妙的结合，对于人像面容中眼角唇边等表露感情的关键部位，也特别着重掌握精确与含蓄的辩证关系，达到神韵之境，从而使蒙娜丽莎的微笑具有一种神秘莫测的千古奇韵，那如梦似的妩媚微笑，被不少美术史家称为“神秘的微笑”。', audio:'audio/test/minion_ring_ring.mp3'}
    ],
    getObjects: function() {
      return this.objects
    },
    getObjectsOfMuseum: function(museumId) {
      //var dfd = $q.defer()
      var objectsOfMuseum = [];
      this.objects.forEach(function(object) {
        if (object.museumid == museumId) {
          //dfd.resolve(object);
          objectsOfMuseum.push(object);
        }
      })
      return objectsOfMuseum;
    },
    getObject: function(objectId) {
      var dfd = $q.defer();
      this.objects.forEach(function(object) {
        if (object.id == objectId) dfd.resolve(object);
      })
      return dfd.promise;
    }

  }
})
.service('MuseumsService', function($q) {
  return {
    museums: [
      { name: '卢浮宫 Musée du louvre', img: 'img/big/louvre@2x.png', id: 1, imgobject: 'img/big/object-louvre@2x.png', imginfo: 'img/big/info-louvre@2x.png', imgintro: 'img/big/intro-louvre@2x.png', introbackground:'img/big/intro-background-louvre@2x.png', audio:'audio/test/minion_ring_ring.mp3', description:'位于法国巴黎市中心的塞纳河北岸（右岸），原是法国的王宫，居住过50位法国国王和王后，现是卢浮宫博物馆，拥有的艺术收藏达40万件以上，包括雕塑、绘画、美术工艺及古代东方，古代埃及和古希腊罗马等6个门类。博物馆收藏目录上记载的艺术品数量已达400000件，分为许多的门类品种，从古代埃及、希腊、埃特鲁里亚、罗马的艺术品，到东方各国的艺术品，有从中世纪到现代的雕塑作品，还有数量惊人的王室珍玩以及绘画精品等等。迄今为止，卢浮宫已成为世界著名的艺术殿堂。' },
      { name: '奥赛 Musée d\'orsay', img: 'img/big/orsay@2x.png', id: 2,  imgobject: 'img/big/object-louvre@2x.png', imginfo: 'img/big/info-louvre@2x.png', imgintro: 'img/big/intro-louvre@2x.png', introbackground:'img/big/intro-background-louvre@2x.png', audio:'audio/test/minion_ring_ring.mp3', description:'位于法国巴黎市中心的塞纳河北岸（右岸），原是法国的王宫，居住过50位法国国王和王后，现是卢浮宫博物馆，拥有的艺术收藏达40万件以上，包括雕塑、绘画、美术工艺及古代东方，古代埃及和古希腊罗马等6个门类。博物馆收藏目录上记载的艺术品数量已达400000件，分为许多的门类品种，从古代埃及、希腊、埃特鲁里亚、罗马的艺术品，到东方各国的艺术品，有从中世纪到现代的雕塑作品，还有数量惊人的王室珍玩以及绘画精品等等。迄今为止，卢浮宫已成为世界著名的艺术殿堂。'},
      { name: '蓬皮杜 Centre pompidou', img: 'img/big/pompidou@2x.png', id: 3,  imgobject: 'img/big/object-louvre@2x.png', imginfo: 'img/big/info-louvre@2x.png', imgintro: 'img/big/intro-louvre@2x.png', introbackground:'img/big/intro-background-louvre@2x.png', audio:'audio/test/minion_ring_ring.mp3', description:'位于法国巴黎市中心的塞纳河北岸（右岸），原是法国的王宫，居住过50位法国国王和王后，现是卢浮宫博物馆，拥有的艺术收藏达40万件以上，包括雕塑、绘画、美术工艺及古代东方，古代埃及和古希腊罗马等6个门类。博物馆收藏目录上记载的艺术品数量已达400000件，分为许多的门类品种，从古代埃及、希腊、埃特鲁里亚、罗马的艺术品，到东方各国的艺术品，有从中世纪到现代的雕塑作品，还有数量惊人的王室珍玩以及绘画精品等等。迄今为止，卢浮宫已成为世界著名的艺术殿堂。'},
      { name: '蓬皮杜 Centre pompidou', img: 'img/big/pompidou@2x.png', id: 3,  imgobject: 'img/big/object-louvre@2x.png', imginfo: 'img/big/info-louvre@2x.png', imgintro: 'img/big/intro-louvre@2x.png', introbackground:'img/big/intro-background-louvre@2x.png', audio:'audio/test/minion_ring_ring.mp3', description:'位于法国巴黎市中心的塞纳河北岸（右岸），原是法国的王宫，居住过50位法国国王和王后，现是卢浮宫博物馆，拥有的艺术收藏达40万件以上，包括雕塑、绘画、美术工艺及古代东方，古代埃及和古希腊罗马等6个门类。博物馆收藏目录上记载的艺术品数量已达400000件，分为许多的门类品种，从古代埃及、希腊、埃特鲁里亚、罗马的艺术品，到东方各国的艺术品，有从中世纪到现代的雕塑作品，还有数量惊人的王室珍玩以及绘画精品等等。迄今为止，卢浮宫已成为世界著名的艺术殿堂。'}
    ],
    getMuseums: function() {
      return this.museums
    },
    
    getMuseum: function(museumId) {
      var dfd = $q.defer();
      this.museums.forEach(function(museum) {
        if (museum.id == museumId) dfd.resolve(museum);
      })

      return dfd.promise;
    }

  }
})
.config(function($stateProvider, $urlRouterProvider, hammerDefaultOptsProvider) {
  $stateProvider

    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })
  .state('app.paris', {
    url: '/paris',
    views: {
      'menuContent': {
        templateUrl: 'templates/paris.html',
        controller: 'ParisCtrl'
      }
    }
  })

  .state('app.map', {
    url: '/map',
    views: {
      'menuContent': {
        templateUrl: 'templates/map.html'
      }
    }
  })

  .state('app.introduce', {
      url: '/introduce',
      views: {
        'menuContent': {
          templateUrl: 'templates/introduce.html'
        }
      }
    })

    .state('app.museums', {
      url: '/museums',
      views: {
        'menuContent': {
          templateUrl: 'templates/museums.html',
          controller: 'museumsCtrl'
        }
      },
      resolve: {
        museums: function(MuseumsService) {
          return MuseumsService.getMuseums();
        }
      }
    })
    .state('app.contact', {
      url: '/contact',
      views: {
        'menuContent': {
          templateUrl: 'templates/contact.html'
        }
      }
    })
    .state('app.museum', {
      url: '/museums/:museumId',
      views: {
        'menuContent': {
          templateUrl: 'templates/museum.html',
          controller: 'MuseumCtrl'
        }
      },
      resolve: {
        museum: function($stateParams, MuseumsService) {
          return MuseumsService.getMuseum($stateParams.museumId);
        }
      }
    })
    .state('app.objectsmuseum', {
      url: '/objects/:museumId',
      views: {
        'menuContent': {
          templateUrl: 'templates/objects.html',
          controller: 'ObjectsCtrl'
        }
      },
      resolve: {
        objectsOfMuseum: function($stateParams, ObjectsService) {
          return ObjectsService.getObjectsOfMuseum($stateParams.museumId);
        }
      }
    })
    .state('app.introobject', {
      url: '/objects/introobject/:objectId',
      views: {
        'menuContent': {
          templateUrl: 'templates/introaudio.html',
          controller: 'IntroAudioCtrl'
        }
      },
      resolve: {
        introobject: function($stateParams, ObjectsService) {
          return ObjectsService.getObject($stateParams.objectId);
        }
      }
    })
    .state('app.intromuseum', {
      url: '/museum/intro/:museumId',
      views: {
        'menuContent': {
          templateUrl: 'templates/introaudio.html',
          controller: 'IntroAudioCtrl'
        }
      },
      resolve: {
        introobject: function($stateParams, MuseumsService) {
          return MuseumsService.getMuseum($stateParams.museumId);
        }
      }
    });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/paris');
  hammerDefaultOptsProvider.set({
    recognizers: [[Hammer.Pan, {time: 250}]]
  });
});
