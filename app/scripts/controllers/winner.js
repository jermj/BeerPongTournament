'use strict';

angular.module('beerPongTournamentApp')
  .controller('WinnerCtrl', function ($scope,Tournament) {
   
      var playoffs = Tournament.getPlayoffs(),
          winner = playoffs.pop()['teams'][0];
      
      console.log('winner',playoffs,winner);
            
      $scope.winner = winner;
  });
