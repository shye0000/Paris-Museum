starterControllers
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
    }, null);

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
});