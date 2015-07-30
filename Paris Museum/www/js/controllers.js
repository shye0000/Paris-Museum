angular.module('starter.controllers', [])

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

.controller('museumsCtrl', function($scope, $rootScope) {
  $scope.$on('$ionicView.beforeEnter', function() {
      $rootScope.barColor = '#2482B4';
      $rootScope.fakebarColor = '#31C3F6';
  });
  $scope.museums = [
    { name: '卢浮宫 Musée du louvre', img: 'img/big/louvre@2x.png', id: 1 },
    { name: '奥赛 Musée d\'orsay', img: 'img/big/orsay@2x.png', id: 2 },
    { name: '蓬皮杜 Centre pompidou', img: 'img/big/pompidou@2x.png', id: 3 },
    { name: '蓬皮杜 Centre pompidou', img: 'img/big/pompidou@2x.png', id: 3 }
  ];
})

.controller('ParisCtrl', function($scope, $rootScope) {
  $scope.$on('$ionicView.beforeEnter', function() {
      $rootScope.barColor = '#3A2D3E';
      $rootScope.fakebarColor = '#31C3F6';
  });
  /*$scope.playlists = [
    { title: 'Reggae', id: 1 },
    { title: 'Chill', id: 2 },
    { title: 'Dubstep', id: 3 },
    { title: 'Indie', id: 4 },
    { title: 'Rap', id: 5 },
    { title: 'Cowbell', id: 6 }
  ];*/
})
.controller('MuseumCtrl', function($scope, $stateParams, $rootScope) {
  $scope.$on('$ionicView.beforeEnter', function() {
      $rootScope.barColor = '#2482B4';
      $rootScope.fakebarColor = '#31C3F6';
  });
  var id = $stateParams.museumId;
  var museums = [
    { name: '卢浮宫 Musée du louvre', img: 'img/big/louvre@2x.png', id: 1, imgobject: 'img/big/object-louvre@2x.png', imginfo: 'img/big/info-louvre@2x.png', imgintro: 'img/big/intro-louvre@2x.png' },
    { name: '奥赛 Musée d\'orsay', img: 'img/big/orsay@2x.png', id: 2,  imgobject: 'img/big/object-louvre@2x.png', imginfo: 'img/big/info-louvre@2x.png', imgintro: 'img/big/intro-louvre@2x.png'},
    { name: '蓬皮杜 Centre pompidou', img: 'img/big/pompidou@2x.png', id: 3,  imgobject: 'img/big/object-louvre@2x.png', imginfo: 'img/big/info-louvre@2x.png', imgintro: 'img/big/intro-louvre@2x.png'},
    { name: '蓬皮杜 Centre pompidou', img: 'img/big/pompidou@2x.png', id: 3,  imgobject: 'img/big/object-louvre@2x.png', imginfo: 'img/big/info-louvre@2x.png', imgintro: 'img/big/intro-louvre@2x.png'}
  ];
  for (index = 0; index < museums.length; ++index) {
    if (museums[index].id == id) {
      $scope.museum = museums[index];
      break;
    }
  }
})
.controller('ObjectsCtrl', function($scope, $stateParams, $rootScope) {
  $scope.$on('$ionicView.beforeEnter', function() {
      $rootScope.barColor = '#4A3852';
      $rootScope.fakebarColor = '#3A2D3E';
  });
  var objects = [
    { id: 1, name: '斯芬克斯像', frenchname:'', img: 'img/big/', museumid: 1, imgsmall: 'img/big/object-example.png', description:'', audio:''},
    { id: 2, name: '米洛岛的维纳斯', frenchname:'Vénus de Milo', img: 'img/big/', museumid: 1, imgsmall: 'img/big/object-example.png', description:'', audio:''},
    { id: 3, name: '萨莫色雷斯的胜利女神', frenchname:'La Victoire de Samothrace', img: 'img/big/', museumid: 1, imgsmall: 'img/big/object-example.png', description:'', audio:''},
    { id: 4, name: '荷拉斯兄弟之誓', frenchname:'Le Serment des Horaces', img: 'img/big/', museumid: 1, imgsmall: 'img/big/object-example.png', description:'', audio:''},
    { id: 5, name: '拿破仑一世与约瑟芬皇后加冕礼', frenchname:'', img: 'img/big/', museumid: 1, imgsmall: 'img/big/object-example.png', description:'', audio:''},
    { id: 6, name: '大宫女', frenchname:'La Grande Odalisque', img: 'img/big/', museumid: 1, imgsmall: 'img/big/object-example.png', description:'', audio:''},
    { id: 7, name: '加纳的婚礼', frenchname:'Les Noces de Cana', img: 'img/big/', museumid: 1, imgsmall: 'img/big/object-example.png', description:'', audio:''},
    { id: 8, name: '奥赛展品示例1', frenchname:'Orsay example 1', img: 'img/big/', museumid: 2, imgsmall: 'img/big/object-example.png', description:'', audio:''},
    { id: 9, name: '奥赛展品示例2', frenchname:'Orsay example 2', img: 'img/big/', museumid: 2, imgsmall: 'img/big/object-example.png', description:'', audio:''},
    { id: 10, name: '奥赛展品示例3', frenchname:'Orsay example 3', img: 'img/big/', museumid: 2, imgsmall: 'img/big/object-example.png', description:'', audio:''},
    { id: 11, name: '奥赛展品示例4', frenchname:'Orsay example 4', img: 'img/big/', museumid: 2, imgsmall: 'img/big/object-example.png', description:'', audio:''},
    { id: 12, name: '奥赛展品示例5', frenchname:'Orsay example 5', img: 'img/big/', museumid: 2, imgsmall: 'img/big/object-example.png', description:'', audio:''},
    { id: 13, name: '奥塞尔女郎', frenchname:'Dame d\'Auxerre', img: 'img/big/', museumid: 1, imgsmall: 'img/big/object-example.png', description:'', audio:''},
    { id: 14, name: '让柏的骑士', frenchname:'Cavalier Rampin', img: 'img/big/', museumid: 1, imgsmall: 'img/big/object-example.png', description:'', audio:''},
    { id: 15, name: '拉伯德的头像', frenchname:'Tête Laborde', img: 'img/big/', museumid: 1, imgsmall: 'img/big/object-example.png', description:'', audio:''},
    { id: 16, name: '克尼德的阿弗洛狄忒', frenchname:'Aphrodite de Cnide', img: 'img/big/', museumid: 1, imgsmall: 'img/big/object-example.png', description:'', audio:''},
    { id: 17, name: '奥赛展品示例6', frenchname:'Orsay example 6', img: 'img/big/', museumid: 2, imgsmall: 'img/big/object-example.png', description:'', audio:''},
    { id: 18, name: '奥赛展品示例7', frenchname:'Orsay example 7', img: 'img/big/', museumid: 2, imgsmall: 'img/big/object-example.png', description:'', audio:''},
    { id: 19, name: '奥赛展品示例8', frenchname:'Orsay example 8', img: 'img/big/', museumid: 2, imgsmall: 'img/big/object-example.png', description:'', audio:''},
    { id: 20, name: '奥赛展品示例9', frenchname:'Orsay example 9', img: 'img/big/', museumid: 2, imgsmall: 'img/big/object-example.png', description:'', audio:''},
    { id: 21, name: '奥赛展品示例10', frenchname:'Orsay example 10', img: 'img/big/', museumid: 2, imgsmall: 'img/big/object-example.png', description:'', audio:''},
    { id: 22, name: '蓬皮杜展品示例1', frenchname:'Pompidou example 1', img: 'img/big/', museumid: 3, imgsmall: 'img/big/object-example.png', description:'', audio:''},
    { id: 23, name: '蓬皮杜展品示例2', frenchname:'Pompidou example 2', img: 'img/big/', museumid: 3, imgsmall: 'img/big/object-example.png', description:'', audio:''}
  ];
  $scope.objects = [];
  for (index = 0; index < objects.length; ++index) {
    if (objects[index].museumid == $stateParams.museumId) {
      $scope.objects.push(objects[index]);
    }
  } 
});