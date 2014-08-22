'use strict';

angular.module('beerPongTournamentApp')
.controller('TablesCtrl', function ($scope,$routeParams,$location,Tournament) {

    var stepPlayoff = Tournament.getPlayoffStepAfterGroup(),
        tables = Tournament.getTables(),
        teams = Tournament.getTeams(),
        playoffs = Tournament.getPlayoffs(),
        tableViewFromGroups = parseInt($routeParams.showButton);

    $scope.showButton = tableViewFromGroups;

    $scope.tables = tables;

    //playoff
    if(stepPlayoff >-1){
        var nbrOfGroups = Tournament.getNumberOfGroups(),
            numberOfTeamsQualifiedPerGroups = Math.pow(2,stepPlayoff+1)/nbrOfGroups;

        $scope.numberOfTeamsQualifiedPerGroups = numberOfTeamsQualifiedPerGroups;

        //set teams for playoffs if not tables from menu
        if(tableViewFromGroups){

            var teamsQualified = [],
                tmpTeams = angular.copy(teams);


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

            $scope.goNextStep = function(){
                $location.path('/playoffs/0');
            };
        }
    }
    //simple championship = only 1 group, winner is first
    else{
        $scope.numberOfTeamsQualifiedPerGroups = 1;
        
        var winner = tables[0]['table'][0],
            tmpTeams = angular.copy(teams),
            a = tmpTeams[0]['teams'].length;
        
        while( a-- ) {
            if( tmpTeams[0]['teams'][a]['name'] === winner.name){
                Tournament.setWinner(tmpTeams[0]['teams'][a]);
                break;
            }
        }

        
        $scope.goNextStep = function(){  
            $location.path('/winner');
        };
    }

});
