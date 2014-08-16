'use strict';

angular.module('beerPongTournamentApp')
  .controller('TablesCtrl', function ($scope,Tournament) {
    
      $scope.tables = Tournament.getTables();
      console.log('tables',$scope.tables);
      
      var stepPlayoff = Tournament.getPlayoffStepAfterGroup();
      //playoff
      if(stepPlayoff >-1){
          var nbrOfGroups = Tournament.getNumberOfGroups();
          $scope.numberOfTeamsQualifiedPerGroups = Math.pow(2,stepPlayoff+1)/nbrOfGroups;
          console.log(stepPlayoff,nbrOfGroups,$scope.numberOfTeamsQualifiedPerGroups);
      }
      //simple championship = only 1 group
      else{
        alert('game finish');
      }
      
      
  });
