'use strict';

angular.module('beerPongTournamentApp')
  .controller('HomeCtrl', function ($scope,localStorageService) {
      
      $scope.isTournamentPlaying = localStorageService.get('tournamentSettings');
      $scope.lastTournamentPath = localStorageService.get('tournamentPath');
      
  });
