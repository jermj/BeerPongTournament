'use strict';

angular.module('beerPongTournamentApp')
  .controller('WinnerCtrl', function ($scope,Tournament) {
   
      var playoffs = angular.copy(Tournament.getPlayoffs()),
          winner = playoffs.pop()['teams'][0];
            
      $scope.winner = winner;
  });
