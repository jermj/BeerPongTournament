'use strict';

angular.module('beerPongTournamentApp')
.controller('TeamNamingCtrl', function ($scope,$location,Tournament) {

    var numberOfGroups = Tournament.getNumberOfGroups(),
        numberOfTeamsPerGroup = Tournament.getNumberOfTeamsPerGroup(),
        numberOfPlayerPerTeam = Tournament.getNumberOfPlayerPerTeam(),
        isDirectTournament = Tournament.isADirectTournament(),
        groups=[],
        teamCompt =1,
        playerCompt =1;

    if(isDirectTournament){
        var group = {
            name: 'Direct Tournament',
            teams:[]
        };
        
        for(var y=0, len2=numberOfTeamsPerGroup; y < len2; y++){
            group.teams.push({
                name: 'Team '+teamCompt++,
                players: []
            });

            for(var z=0, len3=numberOfPlayerPerTeam; z < len3; z++){
                group.teams[y]['players'].push({
                    name: 'Player '+playerCompt++,
                });
            }
        }
        groups.push(group);
        $scope.groups = groups;
    }
    else{
        for(var x=0, len=numberOfGroups; x < len; x++){
            var group = {
                name: 'GROUP '+ String.fromCharCode(65 + x), //97 lowercase
                teams:[]
            }
            for(var y=0, len2=numberOfTeamsPerGroup; y < len2; y++){
                group.teams.push({
                    name: 'Team '+teamCompt++,
                    players: []
                });

                for(var z=0, len3=numberOfPlayerPerTeam; z < len3; z++){
                    group.teams[y]['players'].push({
                        name: 'Player '+playerCompt++,
                    });
                }
            }
            groups.push(group);
            $scope.groups = groups;
        }
    }


    console.log('groups',groups);

    $scope.startTournament = function(){
        Tournament.setTeams($scope.groups); 
        if(isDirectTournament){
            $location.path('/playoffs/0');
        }
        else{
            $location.path('/groups');
        }
        
    }


});
