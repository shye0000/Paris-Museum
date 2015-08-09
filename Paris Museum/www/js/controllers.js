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

.controller('MapCtrl', function($scope, $rootScope, $cordovaStatusbar, $ionicLoading, $ionicSideMenuDelegate, wifi, wc) {
  $scope.$on('$ionicView.beforeEnter', function() {
    $rootScope.barColor = '#4A3852';
    $rootScope.fakebarColor = '#3A2D3E';
    if (window.StatusBar) {
      StatusBar.backgroundColorByHexString("#3A2D3E");
    }

  });
  $scope.$on('$ionicView.beforeLeave', function() {
    if (GeoMarker) GeoMarker = null;

  });
  $scope.$on('$ionicView.afterEnter', function(){
    $scope.wifimarkers = [];
    $scope.wcmarkers = [];
    GeoMarker = null;
    var paris = new google.maps.LatLng(48.8534100, 2.3488000);
    var mapOptions = {
      center: paris,
      zoomControl: false,
      panControl: false,
      zoom: 11,
      streetViewControl: false,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);
    GeoMarker = new GeolocationMarker($scope.map);
    var currentControlDiv = document.createElement('div');
    var currentControl = new CurrentControl(currentControlDiv, $scope.map);
    currentControlDiv.index = 1;
    $scope.map.controls[google.maps.ControlPosition.BOTTOM_RIGHT].push(currentControlDiv);  
    var centerControlDiv = document.createElement('div');
    var centerControl = new CenterControl(centerControlDiv, $scope.map);
    centerControlDiv.index = 1;
    $scope.map.controls[google.maps.ControlPosition.BOTTOM_RIGHT].push(centerControlDiv); 
  });
  $scope.hideButton = function() {
    document.getElementById("arrowdown").style.display = 'none';
    document.getElementById("arrowup").style.display = 'block';
    document.getElementById("map").style.height = (y - 44 - 40)+ 'px';
    document.getElementById("mapbuttonscontainer").style.height = '40px';
    google.maps.event.trigger($scope.map, "resize");
    var elems = document.getElementsByClassName("maprow");
      for(var i = 0; i < elems.length; i++) {
      elems[i].style.visibility= 'hidden';
    }
  }
  $scope.showButton = function() {
    document.getElementById("arrowdown").style.display = 'block';
    document.getElementById("arrowup").style.display = 'none';
    document.getElementById("map").style.height = (y - 44)*0.66 + 'px';
    document.getElementById("mapbuttonscontainer").style.height = (y - 44)*0.34 + 'px';
    google.maps.event.trigger($scope.map, "resize");
    var elems = document.getElementsByClassName("maprow");
    for(var i = 0; i < elems.length; i++) {
      elems[i].style.visibility= 'visible';
    }  
  }

  function CurrentControl(controlDiv, map) {

    // Set CSS for the control border
    var controlUI = document.createElement('div');
    controlUI.style.cursor = 'pointer';
    //controlUI.style.marginLeft = '5px';
    controlUI.style.width = '40px';
    controlUI.style.height = '40px';
    controlUI.style.textAlign = 'center';
    controlUI.style.lineHeight = '5.8';
    controlUI.style.border = '0px solid #fff';
    controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
    controlUI.style.borderRadius = '4px';
    controlUI.style.backgroundColor = "rgba(255,255,255,0.7)";
    controlUI.style.marginLeft = '5px';
    controlUI.style.marginBottom = '5px';
    controlUI.style.textAlign = 'center';
    controlUI.title = 'Click to get curent location';
    controlDiv.appendChild(controlUI);

    var control = document.createElement('img');
    control.src = "img/big/currenticon.png";
    control.style.width = '30px';
    controlUI.appendChild(control);

    // Setup the click event listeners: simply set the map center to current
    google.maps.event.addDomListener(controlUI, 'click', function() {
        map.setCenter(new google.maps.LatLng(GeoMarker.getPosition().G, GeoMarker.getPosition().K));
        map.setZoom(11);
    });

  }
  function CenterControl(controlDiv, map) {

    // Set CSS for the control border
    var controlUI = document.createElement('div');
    controlUI.style.width = '40px';
    controlUI.style.height = '40px';
    controlUI.style.textAlign = 'center';
    controlUI.style.lineHeight = '5.8';
    controlUI.style.border = '0px solid #fff';
    controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
    controlUI.style.borderRadius = '4px';
    controlUI.style.backgroundColor = "rgba(255,255,255,0.7)";
    controlUI.style.marginBottom = '5px';
    controlUI.style.textAlign = 'center';
    controlUI.title = 'Click to go to paris center';
    controlDiv.appendChild(controlUI);

    // Set CSS for the control interior
    var control = document.createElement('img');
    control.src = "img/big/paris.png";
    control.style.width = '36px';
    controlUI.appendChild(control);

    // Setup the click event listeners: simply set the map to
    // Chicago
    google.maps.event.addDomListener(controlUI, 'click', function() {
      //map.setCenter(chicago)
      map.setCenter(new google.maps.LatLng(48.8534100, 2.3488000));
      map.setZoom(11);
    });

  }
  $scope.$watch('wc.checked', function(newValue, oldValue) {
    if (newValue == true) {
      for(var i = 0; i < wc[0].features.length; i++) {
        //elems[i].style.height= ((y - 44)*0.34-45)/3 + 'px';
        var point = new google.maps.Marker({
          position: new google.maps.LatLng(wc[0].features[i].properties.geom_x_y[0], wc[0].features[i].properties.geom_x_y[1]),
          map: $scope.map,
          //icon: 'img/big/wifi-marker.png'
        });
        $scope.wcmarkers.push(point);
      }
      $scope.map.setCenter(new google.maps.LatLng(48.8534100, 2.3488000));
      $scope.map.setZoom(11);        
    }
    if (newValue == false) {
      for (var i = 0; i < $scope.wcmarkers.length; i++) {
        $scope.wcmarkers[i].setMap(null);
      }
    }
  });
  $scope.$watch('wifi.checked', function(newValue, oldValue) {
    if (newValue == true) {
      for(var i = 0; i < wifi[0].features.length; i++) {
        //elems[i].style.height= ((y - 44)*0.34-45)/3 + 'px';
        var point = new google.maps.Marker({
          position: new google.maps.LatLng(wifi[0].features[i].properties.geo_coordinates[0], wifi[0].features[i].properties.geo_coordinates[1]),
          map: $scope.map,
          icon: 'img/big/wifi-marker.png'
        });
        $scope.wifimarkers.push(point);
      }
      $scope.map.setCenter(new google.maps.LatLng(48.8534100, 2.3488000));
      $scope.map.setZoom(11);        
    }
    if (newValue == false) {
      for (var i = 0; i < $scope.wifimarkers.length; i++) {
        $scope.wifimarkers[i].setMap(null);
      }
    }
  });
  w = window,
      d = document,
      e = d.documentElement,
      g = d.getElementsByTagName('body')[0],
      x = w.innerWidth || e.clientWidth || g.clientWidth,
      y = w.innerHeight|| e.clientHeight|| g.clientHeight;
    document.getElementById("arrowdown").style.display = 'block';
    document.getElementById("arrowup").style.display = 'none';
    document.getElementById("map").style.height = (y - 44)*0.66 + 'px';
    document.getElementById("mapbuttonscontainer").style.height = (y - 44)*0.34 + 'px';
    var elems = document.getElementsByClassName("maprow");
    for(var i = 0; i < elems.length; i++) {
      elems[i].style.height= ((y - 44)*0.34-45)/3 + 'px';
    }  
    $ionicSideMenuDelegate.canDragContent(false);
})

.controller('museumsCtrl', function($scope, $rootScope, museums, $ionicPlatform, $state, $ionicActionSheet, $timeout, $window, $q) {
  $scope.$on('$ionicView.beforeEnter', function() {
    $rootScope.barColor = '#2482B4';
    $rootScope.fakebarColor = '#31C3F6';
    if (window.StatusBar) {
      StatusBar.backgroundColorByHexString("#31C3F6");
    }
    
  });

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
        ondelete(id, foldername);
        return true;
     }
   });
   // For example's sake, hide the sheet after two seconds
   $timeout(function() {
     hideSheet();
   }, 5000);

  };
  function ondelete(id, foldername) {
    dodelete(id, foldername).then(function(result) {
      
      $rootScope.museumjson = result;
      $scope.updateMuseums(museums, $rootScope.museumjson.museums);
      alert('卸载完成');
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
        }, function(){alert('shit');});  
      }, function(){alert('shit');});
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
            }, function(){alert('shit');});
          }, function(){alert('shit');});  
        }, function(){alert('shit');});
      }, function(){alert('安装出错,请重新安装');});
    }, null);
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
    install("Download", foldername+".zip", id).then(function(result) {
      $rootScope.museumjson = result;
      $scope.updateMuseums(museums, $rootScope.museumjson.museums);
      alert('安装完成');
     //$window.location.reload(true);
     //do whatever you want. This will be executed once city value is available
    });
  };
  function install (path,filename) {
    var deferred = $q.defer();
    $rootScope.installing = true;
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
                      }, function(){alert('shit');});
                    }, function(){alert('shit');});
                  }, function(){alert('安装出错,请重新安装');});
                }, function(){alert('安装出错,请重新安装');});
                //alert("Text is: "+this.result);
              }
              reader.readAsText(file);
            }, function(){alert('安装出错,请重新安装');});
          }, function(){alert('安装出错,请重新安装');});

        },null); 
      }, null);
    }, null);
    return deferred.promise;
  };
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
  
})

.controller('IntroAudioCtrl',function($scope, $stateParams, $rootScope, $cordovaStatusbar, $ionicSideMenuDelegate, ngAudio, MediaSrv){
  $scope.$on('$ionicView.beforeEnter', function() {
    $rootScope.barColor = '#2482B4';
    $rootScope.fakebarColor = '#31C3F6';
    if (window.StatusBar) {
      StatusBar.backgroundColorByHexString("#31C3F6");
    }
    /*MediaSrv.loadMedia($scope.introobject.audio).then(function(media) {
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
    
  });*/
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
  document.getElementById("pausebutton").style.display = 'play';
  document.getElementById("currentpoint").style.left = "0%";
  document.getElementById("currenttimeline").style.width = "0%";
  $scope.dragging = false;
  $scope.duration = null;
  mediaTimer = null;
  var mymedia = null; 
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
    if(mymedia === null){ 
      MediaSrv.loadMedia($scope.introobject.audio).then(function(media) {
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
});