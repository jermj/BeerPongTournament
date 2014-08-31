'use strict';

angular
.module('beerPongTournamentApp', [
    'ngRoute',
    'LocalStorageModule'
])
.config(function ($routeProvider,$compileProvider) {
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
    .when('/manualTeamNaming', {
        templateUrl: 'views/manualteamnaming.html',
        controller: 'ManualTeamNamingCtrl'
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
    .when('/playoffsResults', {
        templateUrl: 'views/playoffsresult.html',
        controller: 'PlayoffsResultCtrl'
    })
    .when('/winner', {
        templateUrl: 'views/winner.html',
        controller: 'WinnerCtrl'
    })
    .when('/scorers', {
        templateUrl: 'views/scorers.html',
        controller: 'ScorersCtrl'
    })
    .when('/faq', {
        templateUrl: 'views/faq.html'
    })
    .when('/rules', {
        templateUrl: 'views/rules.html'
    })
    .when('/history', {
        templateUrl: 'views/history.html'
    })
    .otherwise({
        redirectTo: '/'
    });
    
    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|chrome-extension):|data:image\//);

});
