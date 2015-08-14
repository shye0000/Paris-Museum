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

.controller('ParisCtrl', function($scope, $rootScope) {
  $scope.$on('$ionicView.beforeEnter', function() {
      $rootScope.barColor = '#3A2D3E';
      $rootScope.fakebarColor = '#31C3F6';
      if (window.StatusBar) {
        StatusBar.backgroundColorByHexString("#31C3F6");
      }
  });
  w = window,
    d = document,
    e = d.documentElement,
    g = d.getElementsByTagName('body')[0],
    x = w.innerWidth || e.clientWidth || g.clientWidth,
    y = w.innerHeight|| e.clientHeight|| g.clientHeight;
  document.getElementById("parisimg").style.height = (y - 44)/2 + 'px';
  document.getElementById("parisbutton").style.height = (y - 44)/2 + 'px';
  document.getElementById("paristitle").style.bottom = (y - 44)/4 + 'px';
  var elems = document.getElementsByClassName("parisbackground");
  for(var i = 0; i < elems.length; i++) {
    elems[i].style.height= (y - 44)/4 + 'px';
  }
  elems = document.getElementsByClassName("parisbackgroundimg");
  for(var i = 0; i < elems.length; i++) {
    elems[i].style.height= (y - 44)/5 + 'px';
    elems[i].style.top= '50%';
    elems[i].style.marginTop= '-'+(y - 44)/10 + 'px';
    elems[i].style.left= '50%';
    elems[i].style.marginLeft= '-'+(y - 44)/10 + 'px';
  }
})

.controller('MuseumCtrl', function($scope, $stateParams, $rootScope, $q) {
  $scope.$on('$ionicView.beforeEnter', function() {
    $rootScope.barColor = '#2482B4';
    $rootScope.fakebarColor = '#31C3F6';
    if (window.StatusBar) {
      StatusBar.backgroundColorByHexString("#31C3F6");
    }
  });
  w = window,
    d = document,
    e = d.documentElement,
    g = d.getElementsByTagName('body')[0],
    x = w.innerWidth || e.clientWidth || g.clientWidth,
    y = w.innerHeight|| e.clientHeight|| g.clientHeight;
  var elems = document.getElementsByClassName("museumrow");
  
  for(var i = 0; i < elems.length; i++) {
    elems[i].style.height= (y - 44)/3 + 'px';
  }
  elems = document.getElementsByClassName("museumservicebutton");
  for(var i = 0; i < elems.length; i++) {
    elems[i].style.marginTop= (y - 44)/6-18 + 'px';
  }
  for(var i = 0; i < $rootScope.museumjson.museums.length; i++) {
    //alert("/storage/emulated/0" + $rootScope.mediadir + $rootScope.museumjson.museums[i].imgintro);
    if ($rootScope.museumjson.museums[i].id == $stateParams.museumId) {
      $scope.museum = $rootScope.museumjson.museums[i];
      $scope.museum.foldername = $stateParams.folderName;
      break;
    }
  }
  getMuseumObjects($scope.museum.foldername).then(function(result) {
    $rootScope.objectjson = result;
  });
  function getMuseumObjects(foldername) {
    var deferred = $q.defer();
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem){
      fileSystem.root.getFile("parismuseum-media-extension/"+ foldername +"/object.json",{create: false, exclusive: false}, function(fileEntry){
        fileEntry.file(function(file) {
          var reader = new FileReader();
          reader.onloadend = function(e) {
            var objectjson = '{"objects": [' + this.result + ']}';
            var ojson = JSON.parse(objectjson);
            $scope.$apply( function() {
              deferred.resolve(ojson);
            });
          }
          reader.readAsText(file);
        }, null);
      }, null);
    }, null);
    return deferred.promise;
  }
  
})

.controller('ObjectsCtrl', function($scope, $stateParams, $rootScope, $cordovaStatusbar) {
  $scope.$on('$ionicView.beforeEnter', function() {
    $rootScope.barColor = '#4A3852';
    $rootScope.fakebarColor = '#3A2D3E';
    if (window.StatusBar) {
      StatusBar.backgroundColorByHexString("#3A2D3E");
    }
  });
  $scope.objects = $rootScope.objectjson.objects;
  /*for(var i = 0; i < $rootScope.objectjson.objects.length; i++) {
    if ($rootScope.objectjson.objects[i].museumid == $stateParams.museumId) {
      $scope.objects.push($rootScope.objectjson.objects[i]);
    }
  }*/
  
});
var starterControllers = angular.module('starter.controllers');