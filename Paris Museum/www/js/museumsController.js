starterControllers
.controller('museumsCtrl', function($compile, $scope, $rootScope, museums, $ionicPlatform, $state, $ionicActionSheet, $timeout, $window, $q, $ionicBackdrop, $ionicLoading) {
  $scope.$on('$ionicView.beforeEnter', function() {
    $rootScope.barColor = '#2482B4';
    $rootScope.fakebarColor = '#31C3F6';
    if (window.StatusBar) {
      StatusBar.backgroundColorByHexString("#31C3F6");
    }
    
  });
  $scope.showinstall = function(){
    $scope.installing = true;
    $scope.downloading = true;
    $scope.installbusy = true;
    $ionicLoading.show({
      templateUrl: 'templates/installLoading.html',
      scope: $scope
    });
  }
  $scope.showuninstall = function(){
    $scope.uninstalling = true;
    $scope.uninstallbusy = true;
    $ionicLoading.show({
      templateUrl: 'templates/uninstallLoading.html',
      scope: $scope
    });
  }
  $scope.museumclick = function(id, link, foldername, downloaded, e) {
    /*var xPos = e.pageX - angular.element(e.target).prop('offsetLeft'),
        yPos = e.pageY - angular.element(e.target).prop('offsetTop') - 44,
        //ripplediv = $compile("<div class='ripple-effect' style='height:" + angular.element(e.target).prop('clientHeight')/2 + "px;width:" + angular.element(e.target).prop('clientHeight')/2 + "px;top:" + (yPos - (angular.element(e.target).prop('clientHeight')/4)) + "px;left:" + (xPos - (angular.element(e.target).prop('clientHeight')/4)) + "px;'></div>")($scope);
        ripplediv = $compile("<div class='ripple-effect' style='height:" + angular.element(e.target).prop('clientHeight')/3 + "px;width:" + angular.element(e.target).prop('clientHeight')/3 + "px;top:" + (yPos - (angular.element(e.target).prop('clientHeight')/6)) + "px;left:" + (xPos - (angular.element(e.target).prop('clientHeight')/6)) + "px;'></div>")($scope);
    angular.element(e.target).append(ripplediv);*/
    setTimeout(function(){
      //ripplediv.remove();*/
      if (link != ""){
        if (downloaded) {
          $state.go('app.museum', {museumId: id, folderName: foldername});
        } else {
          $scope.askingdownload('other', link, foldername, id);
        }
      }
    }, 1000);
    
  };
  $scope.askingdownload = function(text, link, foldername, id) {
    if (link != ""){
     var question = '';
     if (text == 'download') {
       question = '请确认是否下载本扩展包';
     }else{
       question = '想看更多？想听讲解？点击“确认下载“安装扩展包';
     }
     var hideSheet = $ionicActionSheet.show({
       buttons: [
         { text: '确认下载' }
       ],
       titleText: question,
       cancelText: '以后再说',
       cancel: function() {
         // add cancel code..
       },
       buttonClicked: function(index) {
        $scope.showinstall();
        download(link, foldername, id);
         
        return true;
       }
     });
     // For example's sake, hide the sheet after two seconds
     $timeout(function() {
       hideSheet();
     }, 5000);
    }
   // Show the action sheet
   

  };

  $scope.delete = function(id, foldername) {
   var hideSheet = $ionicActionSheet.show({
     /*buttons: [
       { text: '确认下载' }
     ],*/
     destructiveText: '确认删除',
     titleText: '请确认是否删除本扩展包',
     cancelText: '以后再说',
     cancel: function() {
       // add cancel code..
     },
     destructiveButtonClicked: function() {
        ondelete(id, foldername);
        $scope.showuninstall();
        return true;
     }
   });
   // For example's sake, hide the sheet after two seconds
   $timeout(function() {
     hideSheet();
   }, 5000);

  };
  $scope.uninstallok = function () {
    //$scope.uninstalling = false;
    $ionicLoading.hide();
    //$scope.uninstallbusy = true;
    
  }
  function ondelete(id, foldername) {
    $scope.uninstallstatus = '卸载扩展包...';
    dodelete(id, foldername).then(function(result) {
      $rootScope.museumjson = result;
      $scope.updateMuseums(museums, $rootScope.museumjson.museums);
      $scope.uninstallstatus = '卸载完成';
      $scope.uninstallbusy = false;
      
    });
  }
  function dodelete (id, foldername) {
    var defer = $q.defer();

    var mjson = $rootScope.museumjson;
    findAndRemove(mjson.museums, 'id', id);
    var mjsonstr = JSON.stringify(mjson.museums);
    mjsonstr = mjsonstr.slice(0, -1);
    mjsonstr = mjsonstr.substring(1);

    window.resolveLocalFileSystemURL(cordova.file.applicationStorageDirectory, function(dir){ 
      dir.getDirectory("parismuseum-media-extension", {create: true, exclusive: false}, function(dirEntry){
        dirEntry.getDirectory("louvre", {create: true}, function (entry) {
          entry.removeRecursively(function() {
            console.log("Remove Recursively Succeeded");
          }, null);
        }, null);
        dirEntry.getFile("museum.json", {create: true}, function(fileEntry) {
          fileEntry.createWriter(function(writer){
            writer.write(mjsonstr);
            //window.resolveLocalFileSystemURL(cordova.file.externalRootDirectory + "parismuseum-media-extension/museum.json", function(fileEntry3){
            window.resolveLocalFileSystemURL(cordova.file.applicationStorageDirectory + "parismuseum-media-extension/museum.json", function(fileEntry2){                    
              fileEntry2.file(function(file2) {
                
                var reader = new FileReader();
                reader.onloadend = function(e) {
                  var museumjson = '{"museums": [' + this.result + ']}';
                  var mjson = JSON.parse(museumjson);
                  defer.resolve(mjson);
                }
                  
                reader.readAsText(file2);
              }, null);
            }, null);
          }, null);
        },null);
      }, null);
    }, null);
    return defer.promise;
  }
  function findAndRemove(array, property, value) {
    angular.forEach(array, function(v, k) {
      if (v[property] == value) {
        array.splice(k, 1);
      }
    });
  }
  function download (link, foldername, id) {
    $scope.installstatus = '下载扩展包...';
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem) {
      var ft = new FileTransfer();
      var uri = encodeURI(link);
      var linkarray = link.split('/');
      var downloadPath = fileSystem.root.fullPath + 'Download/' + linkarray[linkarray.length-1];
      downloadPath = fileSystem.root.toURL() + downloadPath;
      //$scope.downloading = true;
      ft.onprogress = function(progressEvent) {
        if (progressEvent.lengthComputable) {
          var perc = Math.floor(progressEvent.loaded / progressEvent.total * 100);
          document.getElementById("percentage").innerHTML = perc + "%";
          if(perc == 0) document.getElementById("downloadbar").style.borderLeftWidth = '1px';
          else document.getElementById("downloadbar").style.borderLeftWidth = perc*2 + 'px';
        } /*else {
          if(statusDom.innerHTML == "") {
            document.getElementById("percentage").innerHTML = "下载准备中";
          } else {
            //document.getElementById("percentage").innerHTML += ".";
          }
        }*/
      };
      ft.download(uri, downloadPath, 
      function(entry) {
        $scope.installstatus = '安装扩展包...';
        install("Download", foldername+".zip", id).then(function(result) {
          $rootScope.museumjson = result;
          $scope.updateMuseums(museums, $rootScope.museumjson.museums);
          $scope.installstatus = '安装完成';
          $scope.installbusy = false;
          $scope.downloading = false;
          
        });
        
      }, function(err){alert(err.code);});
      
    }, null);
    /**/
    
  };
  $scope.downloadok = function(){
    //$scope.installing = false;
    $ionicLoading.hide();
    //$scope.installbusy = true;
    
  }
  function install (path,filename) {
    //$scope.downloading = false;
    var deferred = $q.defer();
    //$scope.installing = true;
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem) {
      //fileSystem.root.getDirectory("parismuseum-media-extension", {create: true, exclusive: false},  function(dir){
      window.resolveLocalFileSystemURL(cordova.file.applicationStorageDirectory, function(dir){ 
        dir.getDirectory("parismuseum-media-extension", {create: true, exclusive: false}, function(dirEntry){
          //alert(dirEntry.fullPath);
          zip.unzip(fileSystem.root.toURL() + path + '/' + filename, dirEntry.fullPath, function(){
            window.resolveLocalFileSystemURL(cordova.file.applicationStorageDirectory + "parismuseum-media-extension/" + filename.split('.')[0] +"/museum.json", function(fileEntry){
              //dirEntry.getFile()
              fileEntry.file(function(file) {
                var reader = new FileReader();
                reader.onloadend = function(e) {
                  //alert(this.result);
                  var newText = this.result;
                  //window.resolveLocalFileSystemURL(cordova.file.applicationStorageDirectory + "parismuseum-media-extension/museum.json", function(fileEntry2){
                  dirEntry.getFile("museum.json", {create: true}, function(fileEntry2) {
                    fileEntry2.createWriter(function(writer){
                      if(writer.length == 0){
                        writer.write(newText);
                      }else{
                        writer.seek(writer.length);
                        writer.write(',' + newText);
                      }
                      
                      //window.resolveLocalFileSystemURL(cordova.file.externalRootDirectory + "parismuseum-media-extension/museum.json", function(fileEntry3){
                      window.resolveLocalFileSystemURL(cordova.file.applicationStorageDirectory + "parismuseum-media-extension/museum.json", function(fileEntry3){                    
                        fileEntry3.file(function(file3) {
                          
                          var reader = new FileReader();
                          reader.onloadend = function(e) {
                            var museumjson = '{"museums": [' + this.result + ']}';
                            var mjson = JSON.parse(museumjson);
                            deferred.resolve(mjson);
                          }
                            
                          reader.readAsText(file3);
                        }, null);
                      }, null);
                    }, null);
                  },null);
                };
                reader.readAsText(file);
              }, null);
            },null);
          },null);
        /*zip.unzip(fileSystem.root.toURL() + path + '/' + filename, fileSystem.root.toURL() + dir.fullPath, function(){
          //update parismuseum-media-extension/museum.json and parismuseum-media-extension/object.json
          //or create new parismuseum-media-extension/museum.json and parismuseum-media-extension/object.json
          //window.resolveLocalFileSystemURL(cordova.file.externalRootDirectory + "parismuseum-media-extension/" + filename.split('.')[0] +"/museum.json", function(fileEntry){
          window.resolveLocalFileSystemURL(cordova.file.applicationStorageDirectory + "parismuseum-media-extension/" + filename.split('.')[0] +"/museum.json", function(fileEntry){

            fileEntry.file(function(file) {
              var reader = new FileReader();
              reader.onloadend = function(e) {
                var newText = this.result;
                //fileSystem.root.getFile("parismuseum-media-extension/museum.json",{create: true, exclusive: false}, function(fileEntry2){
                window.resolveLocalFileSystemURL(cordova.file.applicationStorageDirectory + "parismuseum-media-extension/museum.json", function(fileEntry2){
                  fileEntry2.createWriter(function(writer){
                    if(writer.length == 0){
                      writer.write(newText);
                    }else{
                      writer.seek(writer.length);
                      writer.write(',' + newText);
                    }
                    
                    //window.resolveLocalFileSystemURL(cordova.file.externalRootDirectory + "parismuseum-media-extension/museum.json", function(fileEntry3){
                    window.resolveLocalFileSystemURL(cordova.file.applicationStorageDirectory + "parismuseum-media-extension/museum.json", function(fileEntry3){                    
                      fileEntry3.file(function(file3) {
                        
                        var reader = new FileReader();
                        reader.onloadend = function(e) {
                          var museumjson = '{"museums": [' + this.result + ']}';
                          var mjson = JSON.parse(museumjson);
                          deferred.resolve(mjson);
                        }
                          
                        reader.readAsText(file3);
                      }, null);
                    }, null);
                  }, null);
                }, null);
              }
              reader.readAsText(file);
            }, null);
          }, null);

        }, null); */
        }, null);
      }, null);
      
    },null);
    return deferred.promise;
  }
  function installError(){
    alert('安装出错,请重新安装');
    $scope.installing = false;
    $scope.installbusy = false;
    $scope.downloading = false;
    $ionicLoading.hide();
  }
  function uninstallError() {
    alert('卸载出错,请重新卸载');
    $scope.uninstalling = false;
    $scope.uninstallbusy = false;
    $ionicLoading.hide();
  }
  $scope.updateMuseums = function (allmuseums, installedmuseums){
    if ($ionicPlatform.is('android')) {
      for (var i = 0; i < allmuseums.length; i++) {
        for (var j = 0; i < installedmuseums.length; i++) {
          if (allmuseums[i].id == installedmuseums[j].id) {
            allmuseums[i]. imgobject = installedmuseums[j].imgobject;
            allmuseums[i]. imginfo = installedmuseums[j].imginfo;
            allmuseums[i]. imgintro = installedmuseums[j].imgintro;
            allmuseums[i]. introbackground = installedmuseums[j].introbackground;
            allmuseums[i].downloaded = true;
          }
        }
        allmuseums[i].downloaded = false;
      }
    }
    
    
    $scope.museums = allmuseums;
  }
  if($ionicPlatform.is('android'))
  $scope.updateMuseums (museums, $rootScope.museumjson.museums);
else{
       $scope.museums=[
      { downloadlink: 'http://shye0000.webfactional.com/static/parismuseum_museum_extension/louvre.zip', downloaded: false, name: '卢浮宫 Musée du louvre', foldername: 'louvre', img: 'img/big/louvre@2x.png', id: 1},
      { downloadlink: '', downloaded: false, name: '奥赛 Musée d\'orsay', foldername: 'orsay', img: 'img/big/orsay@2x.png', id: 2},
      { downloadlink: '', downloaded: false, name: '蓬皮杜 Centre pompidou', foldername: 'pompidou', img: 'img/big/pompidou@2x.png', id: 3}
    ];
    }
  $scope.installing = false;
  $scope.downloading = false;
   $scope.installbusy = false;
  $scope.uninstalling = false;
  $scope.uninstallbusy = false;

  w = window,
      d = document,
      e = d.documentElement,
      g = d.getElementsByTagName('body')[0],
      x = w.innerWidth || e.clientWidth || g.clientWidth,
      y = w.innerHeight|| e.clientHeight|| g.clientHeight;
  
});