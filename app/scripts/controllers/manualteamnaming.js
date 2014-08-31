'use strict';

angular.module('beerPongTournamentApp')
.controller('ManualTeamNamingCtrl', function ($scope,$location,Tournament) {

    var numberOfTeamsPerGroup = Tournament.getNumberOfTeamsPerGroup(),
        isDirectTournament = Tournament.isADirectTournament(),
        numberOfGroups = isDirectTournament ? 1 : Tournament.getNumberOfGroups(),
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
        if(team.players.length === 0){
            $scope.playersMinimum--;
        }
        team.players.push({name:'Player '+playerCompt++,id:playerId++});
    }

    $scope.removePlayer = function(team,player){
        var a = team.players.length;
        while( a-- ) {
            if( team.players[a]['id'] === player.id){
                team.players.splice(a, 1);
                break;
            }
        }
        
        if(team.players.length === 0){
            $scope.playersMinimum++;
        }

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
