// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic', 'ngCordova'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.controller('installControler', function($scope, $ionicPlatform, $cordovaFile, $window) {
  document.addEventListener("deviceready", onDeviceReady, false);
  function onDeviceReady() {
    $scope.installmedia = function(){
      window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFS, fail);
      //alert('Install finished!');
    }
    if ($ionicPlatform.is('android')) {
     /* $cordovaFile.checkDir(cordova.file.applicationStorageDirectory, "files")
        .then(function (success) {
        // success
          alert('dddddddd');
        }, function (error) {
        // error
          alert('ssssssss');
        });*/
    }  
  }

  
  
  function gotFS(fileSystem) {
    window.FS = fileSystem;
    fileSystem.root.getDirectory("parismuseum-media-extension/museum/louvre/audio", {create: true, exclusive: false},  function(dir){
        alert('Package already installed');
    }, function(){
        createDirectory("parismuseum-media-extension/museum/louvre/audio/");
        createDirectory("parismuseum-media-extension/object/louvre/audio/");
        createDirectory("parismuseum-media-extension/museum/louvre/image/");
        createDirectory("parismuseum-media-extension/object/louvre/image/");
        window.resolveLocalFileSystemURL(cordova.file.applicationDirectory + 'www/audio/museum/', function(d){
          var reader = d.createReader();
          reader.readEntries(function(entries){
            var i;
            for (i=0; i<entries.length; i++) { 
              if (entries[i].name.indexOf(".mp3") != -1 || entries[i].name.indexOf(".wmv") != -1) {
                //alert(entries[i].name);
                window.resolveLocalFileSystemURL(cordova.file.applicationDirectory + 'www/audio/museum/' + entries[i].name, function(file){
                  fileSystem.root.getDirectory("parismuseum-media-extension/museum/louvre/audio", {create: true, exclusive: false},  function(dir){
                    file.copyTo(dir, file.name, copyWin, copyFail);
                  }, fail);
                }, fail);
              }
            }
          }, fail);
        },fail);

        window.resolveLocalFileSystemURL(cordova.file.applicationDirectory + 'www/audio/objects/', function(d){
          var reader = d.createReader();
          reader.readEntries(function(entries){
            var i;
            for (i=0; i<entries.length; i++) { 
              if (entries[i].name.indexOf(".mp3") != -1 || entries[i].name.indexOf(".wmv") != -1) {
                //alert(entries[i].name);
                window.resolveLocalFileSystemURL(cordova.file.applicationDirectory + 'www/audio/objects/' + entries[i].name, function(file){
                  fileSystem.root.getDirectory("parismuseum-media-extension/object/louvre/audio", {create: true, exclusive: false},  function(dir){
                    file.copyTo(dir, file.name, copyWin, copyFail);
                  }, fail);
                }, fail);
              }
            }
          }, fail);
        },fail);

        window.resolveLocalFileSystemURL(cordova.file.applicationDirectory + 'www/img/museum/', function(d){
          var reader = d.createReader();
          reader.readEntries(function(entries){
            var i;
            for (i=0; i<entries.length; i++) { 
              if (entries[i].name.indexOf(".png") != -1 || entries[i].name.indexOf(".jpg") != -1) {
                //alert(entries[i].name);
                window.resolveLocalFileSystemURL(cordova.file.applicationDirectory + 'www/img/museum/' + entries[i].name, function(file){
                  fileSystem.root.getDirectory("parismuseum-media-extension/museum/louvre/image", {create: true, exclusive: false},  function(dir){
                    file.copyTo(dir, file.name, copyWin, copyFail);
                  }, fail);
                }, fail);
              }
            }
          }, fail);
        },fail);

        window.resolveLocalFileSystemURL(cordova.file.applicationDirectory + 'www/img/object/', function(d){
          var reader = d.createReader();
          reader.readEntries(function(entries){
            var i;
            for (i=0; i<entries.length; i++) { 
              if (entries[i].name.indexOf(".png") != -1 || entries[i].name.indexOf(".jpg") != -1) {
                //alert(entries[i].name);
                window.resolveLocalFileSystemURL(cordova.file.applicationDirectory + 'www/img/object/' + entries[i].name, function(file){
                  fileSystem.root.getDirectory("parismuseum-media-extension/object/louvre/image", {create: true, exclusive: false},  function(dir){
                    file.copyTo(dir, file.name, copyWin, copyFail);
                  }, fail);
                }, fail);
              }
            }
          }, fail);
        },fail);

        window.resolveLocalFileSystemURL(cordova.file.applicationDirectory + 'www/museum.json', function(fileEntry){
          //alert()
          fileEntry.file(function(file) {
            var reader = new FileReader();
            reader.onloadend = function(e) {
              var newText = this.result;
              fileSystem.root.getFile("parismuseum-media-extension/museum/museum.json",{create: true, exclusive: false}, function(fileEntry){
                fileEntry.createWriter(function(writer){
                  if(writer.length == 0){
                    writer.write(newText);
                  }else{
                    writer.seek(writer.length);
                    writer.write(',' + newText);
                  }
                }, fail);
              }, fail);
              //alert("Text is: "+this.result);
            }
            reader.readAsText(file);
          }, fail);
        }, fail);
        window.resolveLocalFileSystemURL(cordova.file.applicationDirectory + 'www/object.json', function(fileEntry){
          //alert()
          fileEntry.file(function(file) {
            var reader = new FileReader();
            reader.onloadend = function(e) {
              var newText = this.result;
              fileSystem.root.getFile("parismuseum-media-extension/object/object.json",{create: true, exclusive: false}, function(fileEntry){
                fileEntry.createWriter(function(writer){
                  if(writer.length == 0){
                    writer.write(newText);
                  }else{
                    writer.seek(writer.length);
                    writer.write(',' + newText);
                  }
                }, fail);
              }, fail);
              //alert("Text is: "+this.result);
            }
            reader.readAsText(file);
          }, fail);
        }, fail);
      });
    
  }

  function createDirectory(path, success){
    var dirs = path.split("/").reverse();
    var root = window.FS.root;

    var createDir = function(dir){
      //console.log("create dir " + dir);
      root.getDirectory(dir, {
        create : true,
        exclusive : false
      }, successCB, failCB);
    };

    var successCB = function(entry){
      //console.log("dir created " + entry.fullPath);
      root = entry;
      if(dirs.length > 0){
        createDir(dirs.pop());
      }else{
        //console.log("all dir created");
        success(entry);
      }
    };

    var failCB = function(){
      //console.log("failed to create dir " + dir);
    };

    createDir(dirs.pop());
  }


  function copyWin(){
    //alert('Copying worked!');
  }

  function copyFail(){
    alert('Failed in copying files, please retry!');
  }
  function gotFileEntry(fileEntry) {
      fileEntry.createWriter(gotFileWriter, fail);
  }
  function gotFileWriter(writer) {
      writer.onwriteend = function(evt) {
          //console.log("contents of file now 'some sample text'");
          writer.truncate(11);
          writer.onwriteend = function(evt) {
              //console.log("contents of file now 'some sample'");
              writer.seek(4);
              writer.write(" new text");
              writer.onwriteend = function(evt){
                  //console.log("contents of file now 'some different text'");
              }
          };
      };
      writer.write("some sample text");
  }

  function fail(error) {
      //alert('fail: '+error.code);
      alert('Failed in copying files, please retry!');
  }
});