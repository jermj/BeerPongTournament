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
    .when('/groups', {
        templateUrl: 'views/groups.html',
        controller: 'GroupsCtrl'
    })
    .when('/playoffs/:round', {
        templateUrl: 'views/playoffs.html',
        controller: 'PlayoffsCtrl'
    })
    .when('/tables/:showButton', {
        templateUrl: 'views/tables.html',
        controller: 'TablesCtrl'
    })
    .when('/winner', {
        templateUrl: 'views/winner.html',
        controller: 'WinnerCtrl'
    })
    .when('/scorers', {
        templateUrl: 'views/scorers.html',
        controller: 'ScorersCtrl'
    })
    .otherwise({
        redirectTo: '/'
    });

});
