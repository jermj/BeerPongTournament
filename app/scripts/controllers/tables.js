'use strict';

angular.module('beerPongTournamentApp')
.controller('TablesCtrl', function ($scope,$routeParams,$location,Tournament) {

    var stepPlayoff = Tournament.getPlayoffStepAfterGroup(),
        tables = Tournament.getTables(),
        teams = Tournament.getTeams();
    
        $scope.showButton = $routeParams.showButton;
    
    console.log('hide button',$scope.hideButton);

    $scope.tables = tables;

    //playoff
    if(stepPlayoff >-1){
        var nbrOfGroups = Tournament.getNumberOfGroups(),
            numberOfTeamsQualifiedPerGroups = Math.pow(2,stepPlayoff+1)/nbrOfGroups;

        $scope.numberOfTeamsQualifiedPerGroups = numberOfTeamsQualifiedPerGroups;

        //set teams for playoffs
        //Tournament.SetTeamsQualifiedForPlayoff();

        var teamsQualified = [],
            tmpTeams = angular.copy(teams);

        console.log('teams',teams,tables);

        for(var i = 0; i< teams.length; i++){
            for(var j = 0; j<numberOfTeamsQualifiedPerGroups;j++){
                var a = tmpTeams[i]['teams'].length;
                while( a-- ) {
                    if( tmpTeams[i]['teams'][a]['name'] === tables[i]['table'][j]['name']){
                        teamsQualified.push(tmpTeams[i]['teams'][a]);
                        break;
                    }
                }
                
            }
        }

        Tournament.SetTeamsQualifiedForPlayoff(teamsQualified);
        console.log('teamsQualified',teamsQualified);

        $scope.goNextStep = function(){
            $location.path('/playoffs/0');
        };
    }
    //simple championship = only 1 group
    else{
        $scope.goNextStep = function(){
            $location.path('/winner');
        };
    }

});
