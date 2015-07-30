// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js

angular.module('starter', ['ionic', 'starter.controllers'])

.run(function($ionicPlatform, $state, $rootScope) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
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
      }
    })
    .state('app.objectsmuseum', {
      url: '/objects/:museumId',
      views: {
        'menuContent': {
          templateUrl: 'templates/objects.html',
          controller: 'ObjectsCtrl'
        }
      }
    });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/paris');
});
