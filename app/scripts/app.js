'use strict';

angular
  .module('beerPongTournamentApp', [
    'ngRoute'
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
      .otherwise({
        redirectTo: '/'
      });

  });
