'use strict';

angular.module('beerPongTournamentApp')
.controller('ManualTeamNamingCtrl', function ($scope,$location,Tournament) {

    var numberOfGroups = Tournament.getNumberOfGroups(),
        numberOfTeamsPerGroup = Tournament.getNumberOfTeamsPerGroup(),
        isDirectTournament = Tournament.isADirectTournament(),
        groups=[],
        teamCompt =1,
        playerCompt =1,
        group,
        playerId=1;
    
        $scope.playersMinimum = numberOfGroups*numberOfTeamsPerGroup;

    if(isDirectTournament){
        group = {
            name: 'Direct Tournament',
            teams:[]
        };

        for(var y=0; y < numberOfTeamsPerGroup; y++){
            group.teams.push({
                name: 'Team '+teamCompt++,
                players: []
            });

        }
        groups.push(group);
        $scope.groups = groups;
    }
    else{
        for(var x=0, len=numberOfGroups; x < len; x++){
            group = {
                name: 'GROUP '+ String.fromCharCode(65 + x), //97 lowercase
                teams:[]
            };
            for(var i=0, len2=numberOfTeamsPerGroup; i < len2; i++){
                group.teams.push({
                    name: 'Team '+teamCompt++,
                    players: []
                });

            }
            groups.push(group);
            $scope.groups = groups;
        }
    }

    $scope.addPlayer = function(team){
        console.log(team.players,team.players.length);
        if(team.players.length === 0){
            $scope.playersMinimum--;
        }
        team.players.push({name:'Player '+playerCompt++,id:playerId++});
    }

    $scope.startTournament = function(){
        Tournament.setTeams($scope.groups); 
        if(isDirectTournament){
            $location.path('/playoffs/0');
        }
        else{
            $location.path('/groups');
        }
    };

});
