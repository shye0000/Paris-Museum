angular.module('starter.controllers', ['ngAudio'])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, $rootScope) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})

.controller('museumsCtrl', function($scope, $rootScope, museums) {
  $scope.$on('$ionicView.beforeEnter', function() {
    $rootScope.barColor = '#2482B4';
    $rootScope.fakebarColor = '#31C3F6';
    if (window.StatusBar) {
      StatusBar.backgroundColorByHexString("#31C3F6");
    }
  });
  $scope.museums = museums;
})

.controller('ParisCtrl', function($scope, $rootScope) {
  $scope.$on('$ionicView.beforeEnter', function() {
      $rootScope.barColor = '#3A2D3E';
      $rootScope.fakebarColor = '#31C3F6';
      if (window.StatusBar) {
        StatusBar.backgroundColorByHexString("#31C3F6");
      }
  });
})

.controller('MuseumCtrl', function($scope, $stateParams, $rootScope, museum) {
  $scope.$on('$ionicView.beforeEnter', function() {
    $rootScope.barColor = '#2482B4';
    $rootScope.fakebarColor = '#31C3F6';
    if (window.StatusBar) {
      StatusBar.backgroundColorByHexString("#31C3F6");
    }
  });
  $scope.museum = museum;
})

.controller('ObjectsCtrl', function($scope, $stateParams, $rootScope, $cordovaStatusbar, objectsOfMuseum) {
  $scope.$on('$ionicView.beforeEnter', function() {
    $rootScope.barColor = '#4A3852';
    $rootScope.fakebarColor = '#3A2D3E';
    if (window.StatusBar) {
      StatusBar.backgroundColorByHexString("#3A2D3E");
    }
  });
  $scope.objects = objectsOfMuseum;
})

.controller('IntroAudioCtrl',function($scope, $stateParams, $rootScope, $cordovaStatusbar, $ionicSideMenuDelegate, introobject, ngAudio, MediaSrv){
  $scope.$on('$ionicView.beforeEnter', function() {
    $rootScope.barColor = '#2482B4';
    $rootScope.fakebarColor = '#31C3F6';
    if (window.StatusBar) {
      StatusBar.backgroundColorByHexString("#31C3F6");
    }
  });
  $scope.$on('$ionicView.afterEnter', function() {
    $scope.playAudio();
  });
  $scope.$on('$ionicView.beforeLeave', function() {
    if(mymedia) {
      mymedia.stop();
      
      mymedia.release();
    }if(mediaTimer){
      clearInterval(mediaTimer);
    }
  });
  //$scope.playing = false;
   w = window,
    d = document,
    e = d.documentElement,
    g = d.getElementsByTagName('body')[0],
    x = w.innerWidth || e.clientWidth || g.clientWidth,
    y = w.innerHeight|| e.clientHeight|| g.clientHeight;
  document.getElementById("playbutton").style.display = 'none';
  document.getElementById("pausebutton").style.display = 'play';
  document.getElementById("currentpoint").style.left = "0%";
  document.getElementById("currenttimeline").style.width = "0%";
  $scope.dragging = false;
  $scope.duration = null;
  mediaTimer = null;
  var mymedia = null; 
  if ($stateParams.museumId) {
    $scope.introobject = introobject;
    $scope.name="展馆介绍";
    document.getElementById("locationbutton").style.display = "none";
    document.getElementById("timer").style.left = "80%";
  }
  else {
    $scope.introobject = introobject;
    $scope.name=$scope.introobject.name + ' ' + $scope.introobject.frenchname;
  }
  document.getElementById("currentTime").innerHTML = "00:00";

  MediaSrv.loadMedia($scope.introobject.audio).then(function(media) {
    mymedia = media;
    
  });
  var counter = 0;
  var timerDur = setInterval(function() {
    counter = counter + 100;
    if(counter > 2000) {clearInterval(timerDur);}
    var dur = mymedia.getDuration();
    if (dur > 0) {
      clearInterval(timerDur);
      var minutes = Math.floor(dur / 60);
      minutes = minutes > 9 ? minutes: "0" + minutes;
      var seconds = Math.floor(dur - minutes * 60);
      seconds = seconds > 9 ? seconds: "0" + seconds;
      document.getElementById("duration").innerHTML = "/" + minutes + ":" + seconds;
      $scope.durationstring = minutes + ":" + seconds;
      $scope.duration = dur;
    }
  }, 100);
  $scope.playAudio = function() {
    if(mymedia) {
      mymedia.play();
      $scope.played = true;
      mediaTimer = setInterval(function () {
    // get media position
        mymedia.getCurrentPosition(
          // success callback
          function (position) {
            if (position > -1) {
              var minutes = Math.floor(position / 60);
              minutes = minutes > 9 ? minutes: "0" + minutes;
              var seconds = Math.floor(position - minutes * 60);
              seconds = seconds > 9 ? seconds: "0" + seconds;
              document.getElementById("currentTime").innerHTML = minutes + ":" + seconds;
              if (!$scope.dragging) {
                document.getElementById("currentpoint").style.left = (position/$scope.duration)*100+'%';
                document.getElementById("currenttimeline").style.width = (position/$scope.duration)*100+'%';
              }
              if ((minutes + ":" + seconds) == $scope.durationstring) {
                clearInterval(mediaTimer);
                mymedia.pause();
                mymedia.seekTo(0);
                $scope.played = false;
                document.getElementById("currentTime").innerHTML = "00:00";
                document.getElementById("playbutton").style.display = 'block';
                document.getElementById("pausebutton").style.display = 'none';
                document.getElementById("currentpoint").style.left = "0%";
                document.getElementById("currenttimeline").style.width = "0%";
                
              }
            }
          },
          // error callback
          function (e) {
              console.log("Error getting pos=" + e);
          }
        );
      }, 100);
      document.getElementById("playbutton").style.display = 'none';
      document.getElementById("pausebutton").style.display = 'block';
    }
  }
  $scope.pauseAudio = function() {
    if(mymedia) {
      mymedia.pause();
      clearInterval(mediaTimer);
      document.getElementById("playbutton").style.display = 'block';
      document.getElementById("pausebutton").style.display = 'none';
    }
  }
  $scope.later = function() {
    if(mymedia) {
      mymedia.getCurrentPosition(
        // success callback
        function (position) {
            if (position > -1) {
              var newPosition = position*1000+5000;
              if (newPosition >= $scope.duration*1000) newPosition = ($scope.duration-2)*1000;
              var percentage = newPosition/($scope.duration*1000);
              document.getElementById("currentpoint").style.left = percentage*100 + "%";
              document.getElementById("currenttimeline").style.width = percentage*100 + "%";
              mymedia.seekTo(newPosition);
              var minutes = Math.floor((newPosition/1000) / 60);
              minutes = minutes > 9 ? minutes: "0" + minutes;
              var seconds = Math.floor((newPosition/1000) - minutes * 60);
              seconds = seconds > 9 ? seconds: "0" + seconds;
              document.getElementById("currentTime").innerHTML = minutes + ":" + seconds;
            }
        },
        // error callback
        function (e) {
            console.log("Error getting pos=" + e);
        }
      );
    }
  }
  $scope.ealier = function() {
    if(mymedia) { 
      mymedia.getCurrentPosition(
        // success callback
        function (position) {
          if (position > -1) {
            var newPosition = position*1000-5000;
            if (newPosition <= 0) newPosition = 0;
            var percentage = newPosition/($scope.duration*1000);
            document.getElementById("currentpoint").style.left = percentage*100 + "%";
            document.getElementById("currenttimeline").style.width = percentage*100 + "%";
            mymedia.seekTo(newPosition);
            var minutes = Math.floor((newPosition/1000) / 60);
            minutes = minutes > 9 ? minutes: "0" + minutes;
            var seconds = Math.floor((newPosition/1000) - minutes * 60);
            seconds = seconds > 9 ? seconds: "0" + seconds;
            document.getElementById("currentTime").innerHTML = minutes + ":" + seconds;

          }
        },
        // error callback
        function (e) {
            console.log("Error getting pos=" + e);
        }
      );
    }
  }
  $scope.touchStart = function(event) {
    document.getElementById("currentpointimg").style.height = "28px";
    document.getElementById("currentpointimg").style.marginTop = "-2px";
    document.getElementById("currenttimeline").style.height = "11px";
    document.getElementById("timeline").style.height = "11px";
    document.getElementById("currenttimeline").style.bottom = "68px";
    document.getElementById("timeline").style.bottom = "68px";
  }
  $scope.dragStart = function(event) {
    $scope.dragging = true;
    $ionicSideMenuDelegate.canDragContent(false);
    $scope.leftcurrentpoint = document.getElementById("currentpoint").style.left;
    $scope.widthcurrenttimeline = document.getElementById("currenttimeline").style.width;
    
  }
  $scope.dragEnd = function(event) {
    document.getElementById("currentpointimg").style.height = "16px";
    document.getElementById("currentpointimg").style.marginTop = "10px";
    document.getElementById("currenttimeline").style.height = "5px";
    document.getElementById("timeline").style.height = "5px";
    document.getElementById("currenttimeline").style.bottom = "65px";
    document.getElementById("timeline").style.bottom = "65px";
    document.getElementById("currentpoint").style.left = (Number($scope.leftcurrentpoint.slice(0, -1))/100) * x + event.deltaX + "px";
    document.getElementById("currenttimeline").style.width = (Number($scope.widthcurrenttimeline.slice(0, -1))/100) * x + event.deltaX + "px";
    var percentage = ((Number($scope.leftcurrentpoint.slice(0, -1)) / 100) * x + event.deltaX) / x;
    var newPosition = percentage * $scope.duration * 1000;
    if (newPosition >= $scope.duration * 1000) newPosition = ($scope.duration-2) * 1000;
    mymedia.seekTo(newPosition);
    var minutes = Math.floor((newPosition / 1000) / 60);
    minutes = minutes > 9 ? minutes: "0" + minutes;
    var seconds = Math.floor((newPosition / 1000) - minutes * 60);
    seconds = seconds > 9 ? seconds: "0" + seconds;
    document.getElementById("currentTime").innerHTML = minutes + ":" + seconds;
    $scope.dragging = false;
    $ionicSideMenuDelegate.canDragContent(true);
  }

  $scope.drag = function(event) {
    document.getElementById("currentpoint").style.left = (Number($scope.leftcurrentpoint.slice(0, -1))/100) * x + event.deltaX + "px";
    document.getElementById("currenttimeline").style.width = (Number($scope.widthcurrenttimeline.slice(0, -1))/100) * x + event.deltaX + "px";

  }
});