'use strict';

angular.module('beerPongTournamentApp')
  .controller('HomeCtrl', function ($scope,localStorageService) {
      
      $scope.lastTournament = localStorageService.get('tournamentPath');
  });
