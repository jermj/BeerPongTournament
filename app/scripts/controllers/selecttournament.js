'use strict';

angular.module('beerPongTournamentApp')
  .controller('SelectTournamentCtrl', function ($scope,GroupEngine) {
   
      $scope.callAlgo = function(numberOfPlayers){
        //TODO buffer 300ms
        
          console.log('great',GroupEngine.getGroupFromNumberOfPlayers(numberOfPlayers));
          
      }
      
  });
