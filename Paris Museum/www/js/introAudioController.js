starterControllers
.controller('IntroAudioCtrl',function($scope, $stateParams, $rootScope, $cordovaStatusbar, $ionicSideMenuDelegate, MediaSrv){
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
  w = window,
    d = document,
    e = d.documentElement,
    g = d.getElementsByTagName('body')[0],
    x = w.innerWidth || e.clientWidth || g.clientWidth,
    y = w.innerHeight|| e.clientHeight|| g.clientHeight;
  //$scope.playing = false;
  document.getElementById("introplayerblock").style.height = y*0.65 + 'px';
  document.getElementById("introdescription").style.marginTop = y*0.65 + 'px';
  document.getElementById("playbutton").style.display = 'none';
  document.getElementById("pausebutton").style.display = 'block';
  document.getElementById("currentpoint").style.left = "0%";
  document.getElementById("currenttimeline").style.width = "0%";
  $scope.dragging = false;
  $scope.duration = null;
  mediaTimer = null;
  mymedia = null; 
  if ($stateParams.museumId) {
    for (var i = 0; i < $rootScope.museumjson.museums.length; i++) {
        if ($stateParams.museumId == $rootScope.museumjson.museums[i].id) {
          $scope.introobject = $rootScope.museumjson.museums[i];
          break;
        }
    }
    //$scope.introobject = introobject;
    $scope.name="展馆介绍";
    document.getElementById("locationbutton").style.display = "none";
    document.getElementById("timer").style.left = "80%";
  }
  else {
    for (var i = 0; i < $rootScope.objectjson.objects.length; i++) {
        if ($stateParams.objectId == $rootScope.objectjson.objects[i].id) {
          $scope.introobject = $rootScope.objectjson.objects[i];
          break;
        }
    }
    //$scope.introobject = introobject;
    $scope.name=$scope.introobject.name + ' ' + $scope.introobject.frenchname;
  }
  document.getElementById("currentTime").innerHTML = "00:00";
  //alert($scope.introobject.audio);

  
  $scope.playAudio = function() {
    if(!mymedia){ 
      MediaSrv.loadMedia($scope.introobject.audio, 'root').then(function(media) {
        mymedia = media;
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
        $scope.playAudio();
      });
    }
    else {
      mymedia.play();
      //alert('playstart');
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
                
                mymedia.pause();
                clearInterval(mediaTimer);
                //mediaTimer = null;
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
              //alert(newPosition);
              if (newPosition >= $scope.duration*1000) newPosition = ($scope.duration-2)*1000;
              mymedia.seekTo(newPosition);
              var percentage = newPosition/($scope.duration*1000);
              document.getElementById("currentpoint").style.left = percentage*100 + "%";
              document.getElementById("currenttimeline").style.width = percentage*100 + "%";
              
              var minutes = Math.floor((newPosition/1000) / 60);
              minutes = minutes > 9 ? minutes: "0" + minutes;
              var seconds = Math.floor((newPosition/1000) - minutes * 60);
              seconds = seconds > 9 ? seconds: "0" + seconds;
              document.getElementById("currentTime").innerHTML = minutes + ":" + seconds;
            }
        },
        // error callback
        function (e) {
            alert('dfdfdf');
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
            //alert(newPosition);
            if (newPosition <= 0) newPosition = 0;
            mymedia.seekTo(newPosition);
            var percentage = newPosition/($scope.duration*1000);
            document.getElementById("currentpoint").style.left = percentage*100 + "%";
            document.getElementById("currenttimeline").style.width = percentage*100 + "%";

            var minutes = Math.floor((newPosition/1000) / 60);
            minutes = minutes > 9 ? minutes: "0" + minutes;
            var seconds = Math.floor((newPosition/1000) - minutes * 60);
            seconds = seconds > 9 ? seconds: "0" + seconds;
            document.getElementById("currentTime").innerHTML = minutes + ":" + seconds;

          }
        },
        // error callback
        function (e) {
            alert('ddddd');
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
})