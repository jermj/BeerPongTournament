'use strict';

angular
.module('beerPongTournamentApp', [
    'ngRoute',
    'LocalStorageModule'
])
.config(function ($routeProvider) {
    $routeProvider
    .when('/', {
        templateUrl: 'views/home.html',
        controller: 'HomeCtrl'
    })
    .when('/selectTournament', {
        templateUrl: 'views/selecttournament.html',
        controller: 'SelectTournamentCtrl'
    })
    .when('/teamNaming', {
        templateUrl: 'views/teamnaming.html',
        controller: 'TeamNamingCtrl'
    })
    .when('/tournament', {
        templateUrl: 'views/tournament.html',
        controller: 'TournamentCtrl'
    })
    .when('/tables', {
        templateUrl: 'views/tables.html',
        controller: 'TablesCtrl'
    })
    .otherwise({
        redirectTo: '/'
    });

});
