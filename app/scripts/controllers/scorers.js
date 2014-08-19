'use strict';

angular.module('beerPongTournamentApp')
  .controller('ScorersCtrl', function ($scope,Tournament) {
    
      $scope.scorers = Tournament.getScorers();
      
      console.log('scorers',$scope.scorers);
      
  });
