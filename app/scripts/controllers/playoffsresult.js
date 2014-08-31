'use strict';

angular.module('beerPongTournamentApp')
  .controller('PlayoffsResultCtrl', function ($scope,Tournament) {
    $scope.playoffsResults = Tournament.getPlayoffsResult();
      
  });
