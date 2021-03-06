app.factory("AuthenticationService", ['$location', '$http', '$q', function($location, $http, $q) {

	var userInfo = {};

	return {
		login: function(credentials) {	
			var q = $q.defer();
	        if( credentials.username === "dispatcher" && credentials.password === "password") {
	            $location.path('/map');	
	        } else {
	        	$http.post('php/login.php', {'username': credentials.username, 'password': credentials.password})
	        		.success(function(data, status, headers, config) {
                        if (data.username !== '') {
                        	userInfo = data;
	            			$location.path('/ambulance');	
	            			q.resolve();
                        }
                        else {
                            q.reject(data.error);
                        }
                    });
            }
            return q.promise;
		},
		logout: function() {
	        $location.path('/');	
		},
		getUsername: function() {
			return userInfo.username ? userInfo.username : undefined;
		}
	};
}]);

app.run(['$rootScope', '$location', 'AuthenticationService', function($rootScope, $location, AuthenticationService) {

	var routesThatRequireAuth = ['/ambulance'];

	$rootScope.$on('$routeChangeStart', function(next, current) { 
		if(_(routesThatRequireAuth).contains($location.path())) { 
			if(!AuthenticationService.getUsername()) {
				$location.path('/');
			}
		}
	});
}]);