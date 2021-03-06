var app = angular.module('app', ['ngRoute']);

app.config(['$routeProvider', function ($routeProvider) {
    $routeProvider
        .when('/',
            {
                controller: 'loginCtrl',
                templateUrl: 'views/login.html'
            })
        .when('/map',
            {
                controller: 'mapCtrl',
                templateUrl: 'views/hospital/map.html'
            })
        .when('/ambulance',
            {
                controller: 'ambulanceCtrl',
                templateUrl: 'views/ambulance/ambulance.html'
            })
        .otherwise({ redirectTo: '/' });
}]);