app.controller('mapCtrl', ['$scope', 'ReceiveService', function ($scope, ReceiveService) {

    $scope.objects = [{},{}];

    $scope.order = [
        "username",
        "state",
        "status",
        "latitude",
        "longitude"
    ];

    // DODAĆ OPCJĘ ŻEBY W RECEIVESERVICE WSZYSTKO BYLO USTALANE, A JA TYLKO PODAJE PRZEZ ZAPYTANIE CZEGO POTRZEBA I KOPIUJE CALY OBIEKT

    setInterval( function() {
        var temp = ReceiveService.getData();

        for (var i = 0; i < temp.length; i++) {
            for (var j = 0; j < $scope.order.length; j++) {
                $scope.objects[i][$scope.order[j]] = temp[i][$scope.order[j]];
            }
            $scope.objects[i].state = $scope.objects[i].state == 0 ? "bussy" : "free";
            $scope.objects[i].status = (new Date() - new Date(temp[i].lastLogin)) > 10000 ? "offline" : "online"; 

            placeAmbulance(i, new google.maps.LatLng($scope.objects[i].latitude, $scope.objects[i].longitude));
        }

        console.log($scope.objects);
    }, 1000);

	function placeAmbulance(i, location) {
		if($scope.objects[i].marker) {
			if($scope.objects[i].marker.position.A == location.A && $scope.objects[i].marker.position.k == location.k) {
				return false;
			}
			$scope.objects[i].marker.setMap(null);
			$scope.objects[i].marker = null;
		}
		$scope.objects[i].marker = new google.maps.Marker({
		    position: location, 
		    map: map
		});
		// console.log($scope.objects[i].marker);
	}

	function placeMarker(location) {
		if($scope.marker) {
			$scope.marker.setMap(null);
			$scope.marker = null;
		}
		$scope.marker = new google.maps.Marker({
		    position: location, 
		    map: map,
		    draggable: true,
		    animation: google.maps.Animation.DROP
		});
	}






	var rendererOptions = {
	    draggable: true
	};

	var directionsDisplay = new google.maps.DirectionsRenderer(rendererOptions);
	var directionsService = new google.maps.DirectionsService();
	var map;

	var australia = new google.maps.LatLng(52.411629, 16.933938);

	function initialize() { 

		var mapOptions = {
		    zoom: 13,
		    center: australia
		};
		map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
		directionsDisplay.setMap(map);
		// directionsDisplay.setPanel(document.getElementById('directionsPanel'));

		google.maps.event.addListener(directionsDisplay, 'directions_changed', function() {
		    computeTotalDistance(directionsDisplay.getDirections());
		});

		

		setInterval( function() {
			google.maps.event.addListener(map, 'click', function(event) {
			   	placeMarker(event.latLng);
				calcRoute();
			});
    	}, 4000);
	}

	function calcRoute() {
		var request = {
		    origin: $scope.marker.position,
		    destination: $scope.objects[1].marker.position,
		    travelMode: google.maps.TravelMode.DRIVING
		};
		directionsService.route(request, function(response, status) {
		    if (status == google.maps.DirectionsStatus.OK) {
		        directionsDisplay.setDirections(response);
		    }
	  	});
	}

	function computeTotalDistance(result) {
		var total = 0;
		var myroute = result.routes[0];
		for (var i = 0; i < myroute.legs.length; i++) {
		    total += myroute.legs[i].distance.value;
		}
		total = total / 1000.0;
		document.getElementById('total').innerHTML = total + ' km';
	}

	google.maps.event.addDomListener(window, 'load', initialize);










	



}]);


