
.controller('museumsCtrl', function($scope, $rootScope, museums, $ionicPlatform, $state, $ionicActionSheet, $timeout, $window, $q, $ionicBackdrop, $ionicLoading) {
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

    //document.getElementById("installdiv").style.width = x*0.8+'px';
    //document.getElementById("installdiv").style.marginLeft = '-'+x*0.4+'px';
    //document.getElementById("downloadbar").style.width = ((x*0.8-20)*0.7)+'px';
    //document.getElementById("percentage").style.width = ((x*0.8-20)*0.3)+'px';
    //document.getElementById("installstatus").innerHTML = '';
  }
  $scope.showuninstall = function(){
    $scope.installing = true;
    $scope.installbusy = true;
    $ionicLoading.show({
      templateUrl: 'templates/uninstallLoading.html',
      scope: $scope
    });

    //document.getElementById("installdiv").style.width = x*0.8+'px';
    //document.getElementById("installdiv").style.marginLeft = '-'+x*0.4+'px';
    //document.getElementById("downloadbar").style.width = ((x*0.8-20)*0.7)+'px';
    //document.getElementById("percentage").style.width = ((x*0.8-20)*0.3)+'px';
    //document.getElementById("installstatus").innerHTML = '';
  }
  $scope.museumclick = function(id, link, foldername, downloaded) {
    
    if (downloaded) {
      $state.go('app.museum', {museumId: id, folderName: foldername});
    } else {
      $scope.askingdownload('other', link, foldername, id);
    }
  };
  $scope.askingdownload = function(text, link, foldername, id) {

   // Show the action sheet
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
        //alert('delete');
        $scope.showuninstall();
        ondelete(id, foldername);
        return true;
     }
   });
   // For example's sake, hide the sheet after two seconds
   $timeout(function() {
     hideSheet();
   }, 5000);

  };
  $scope.uninstallok = function () {
    $scope.installing = false;
    $scope.installbusy = true;
    $ionicLoading.hide();
  }
  function ondelete(id, foldername) {
    dodelete(id, foldername).then(function(result) {
      document.getElementById("installstatus").innerHTML = '卸载完成';
      $scope.installbusy = false;
      $rootScope.museumjson = result;
      $scope.updateMuseums(museums, $rootScope.museumjson.museums);
      //do whatever you want. This will be executed once city value is available
    });
  }
  function dodelete (id, foldername) {
    var deferred = $q.defer();

    var mjson = $rootScope.museumjson;
    findAndRemove(mjson.museums, 'id', id);
    var mjsonstr = JSON.stringify(mjson.museums);
    mjsonstr = mjsonstr.slice(0, -1);
    mjsonstr = mjsonstr.substring(1);

    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem) {
      fileSystem.root.getDirectory("parismuseum-media-extension/" + foldername, {create : true, exclusive : false}, function(entry) {
        entry.removeRecursively(function() {
          console.log("Remove Recursively Succeeded");
        }, uninstallError);  
      }, uninstallError);
      fileSystem.root.getFile("parismuseum-media-extension/museum.json",{create: true, exclusive: false}, function(fileEntry){
        fileEntry.createWriter(function(writer){
          writer.write(mjsonstr);
          window.resolveLocalFileSystemURL(cordova.file.externalRootDirectory + "parismuseum-media-extension/museum.json", function(fileEntry2){
            fileEntry2.file(function(file2) {
              var reader = new FileReader();
              reader.onloadend = function(e) {
                var res = JSON.parse('{"museums": [' + this.result + ']}');
                $scope.$apply( function() {
                  deferred.resolve(res);
                });
              }
              reader.readAsText(file2);
            }, uninstallError);
          }, uninstallError);  
        }, uninstallError);
      }, uninstallError);
    }, uninstallError);
    return deferred.promise;
  }
  function findAndRemove(array, property, value) {
    angular.forEach(array, function(v, k) {
      if (v[property] == value) {
        array.splice(k, 1);
      }
    });
  }
  function download (link, foldername, id) {
    
    //document.getElementById("installstatus").innerHTML = '下载扩展包...';
    
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem) {
      var ft = new FileTransfer();
      var uri = encodeURI(link);
      var linkarray = link.split('/');
      var downloadPath = fileSystem.root.fullPath + 'Download/' + linkarray[linkarray.length-1];
      downloadPath = '/storage/emulated/0' + downloadPath;
      $scope.downloading = true;
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
        //statusDom.innerHTML = "";
        document.getElementById("installstatus").innerHTML = '安装扩展包...';
        install("Download", foldername+".zip", id).then(function(result) {
          $rootScope.museumjson = result;
          //document.getElementById("installdiv").style.padding = '25px'; 
          document.getElementById("installstatus").innerHTML = '安装完成';
          $scope.installbusy = false;
          $scope.downloading = false;
          $scope.updateMuseums(museums, $rootScope.museumjson.museums);


         //$window.location.reload(true);
         //do whatever you want. This will be executed once city value is available
        });
        
      }, null);
      
    }, null);
    /**/
    
  };
  $scope.downloadok = function(){
    $scope.installing = false;
    $scope.installbusy = true;
    //document.getElementById("installstatus").innerHTML = '';
    //document.getElementById("installdiv").style.padding = '10px'; 
    //document.getElementById("downloadbar").style.borderLeftWidth = '1px';
    //document.getElementById("downloadbar").style.width = '200px';
    $ionicLoading.hide();
  }
  function install (path,filename) {
    //$scope.downloading = false;
    var deferred = $q.defer();
    //$scope.installing = true;
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem) {
      fileSystem.root.getDirectory("parismuseum-media-extension", {create: true, exclusive: false},  function(dir){
        zip.unzip('/storage/emulated/0' + '/' + path + '/' + filename, '/storage/emulated/0' + dir.fullPath, function(){
          //update parismuseum-media-extension/museum.json and parismuseum-media-extension/object.json
          //or create new parismuseum-media-extension/museum.json and parismuseum-media-extension/object.json
          window.resolveLocalFileSystemURL(cordova.file.externalRootDirectory + "parismuseum-media-extension/" + filename.split('.')[0] +"/museum.json", function(fileEntry){
            fileEntry.file(function(file) {
              var reader = new FileReader();
              reader.onloadend = function(e) {
                var newText = this.result;
                fileSystem.root.getFile("parismuseum-media-extension/museum.json",{create: true, exclusive: false}, function(fileEntry2){
                  fileEntry2.createWriter(function(writer){
                    if(writer.length == 0){
                      writer.write(newText);
                    }else{
                      writer.seek(writer.length);
                      writer.write(',' + newText);
                    }
                    
                    window.resolveLocalFileSystemURL(cordova.file.externalRootDirectory + "parismuseum-media-extension/museum.json", function(fileEntry3){
                    
                      fileEntry3.file(function(file3) {
                        
                        var reader = new FileReader();
                        reader.onloadend = function(e) {
                          
                          //$rootScope.museumjson = JSON.stringify(eval("(" + "museums: [" + this.result + "])"));
                          //JSON.parse('[' + this.result + ']');
                          //var museumjson = '{"museums": [{ "id": 1, "name": "卢浮宫 Musée du louvre", "img": "museum/louvre/image/louvre@2x.png", "imgobject": "museum/louvre/image/object-louvre@2x.png", "imginfo": "museum/louvre/image/info-louvre@2x.png", "imgintro": "museum/louvre/image/intro-louvre@2x.png", "introbackground":"museum/louvre/image/intro-background-louvre@2x.png", "audio":"museum/louvre/audio/minion_ring_ring.mp3", "description":"位于法国巴黎市中心的塞纳河北岸（右岸），原是法国的王宫，居住过50位法国国王和王后，现是卢浮宫博物馆，拥有的艺术收藏达40万件以上，包括雕塑、绘画、美术工艺及古代东方，古代埃及和古希腊罗马等6个门类。博物馆收藏目录上记载的艺术品数量已达400000件，分为许多的门类品种，从古代埃及、希腊、埃特鲁里亚、罗马的艺术品，到东方各国的艺术品，有从中世纪到现代的雕塑作品，还有数量惊人的王室珍玩以及绘画精品等等。迄今为止，卢浮宫已成为世界著名的艺术殿堂。" }]}';
                          var museumjson = '{"museums": [' + this.result + ']}';
                          //$rootScope.museumjson = JSON.parse(museumjson); 
                          //alert($rootScope.museumjson.museums[0].name);
                          var mjson = JSON.parse(museumjson);
                          $scope.$apply( function() {
                            deferred.resolve(mjson);
                          });
                        }
                          
                        reader.readAsText(file3);
                      }, null);
                    }, null);
                  }, null);
                }, null);
                //alert("Text is: "+this.result);
              }
              reader.readAsText(file);
            }, null);
          }, null);

        }, null); 
      }, null);
    }, null);
    return deferred.promise;
  };
  function installError(){
    alert('安装出错,请重新安装');
    $scope.installing = false;
    $scope.installbusy = true;
    $ionicLoading.hide();
  }
  function uninstallError() {
    alert('卸载出错,请重新卸载');
    $scope.installing = false;
    $scope.installbusy = true;
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
  $scope.updateMuseums (museums, $rootScope.museumjson.museums);
  $scope.installing = false;
  $scope.downloading = false;
  w = window,
      d = document,
      e = d.documentElement,
      g = d.getElementsByTagName('body')[0],
      x = w.innerWidth || e.clientWidth || g.clientWidth,
      y = w.innerHeight|| e.clientHeight|| g.clientHeight;
    //document.getElementById("installdiv").style.width = x*0.8+'px';
    //document.getElementById("installdiv").style.marginLeft = '-'+x*0.4+'px';
    //document.getElementById("downloadbar").style.width = ((x*0.8-20)*0.7)+'px';
    //document.getElementById("percentage").style.width = ((x*0.8-20)*0.3)+'px';
    //document.getElementById("installstatus").innerHTML = '';
  
})