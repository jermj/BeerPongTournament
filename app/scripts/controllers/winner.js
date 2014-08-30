'use strict';

angular.module('beerPongTournamentApp')
.controller('WinnerCtrl', function ($scope,Tournament) {
    $scope.winner = Tournament.getWinner();
    $scope.scorers = Tournament.getScorers();

    
    console.log('playoffs',Tournament.getPlayoffs());
    
});
