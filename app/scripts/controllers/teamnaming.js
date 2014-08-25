'use strict';

angular.module('beerPongTournamentApp')
.controller('TeamNamingCtrl', function ($scope,$location,Tournament) {
    var numberOfGroups = Tournament.getNumberOfGroups(),
        numberOfTeamsPerGroup = Tournament.getNumberOfTeamsPerGroup(),
        numberOfPlayerPerTeam = Tournament.getNumberOfPlayerPerTeam(),
        isDirectTournament = Tournament.isADirectTournament(),
        groups=[],
        teamCompt =1,
        playerCompt =1,
        group;

    function shuffle(array) {
        var currentIndex = array.length, temporaryValue, randomIndex ;

        // While there remain elements to shuffle...
        while (0 !== currentIndex) {

            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            // And swap it with the current element.
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }

        return array;
    }

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

            for(var z=0; z < numberOfPlayerPerTeam; z++){
                playerCompt++;
                group.teams[y]['players'].push({
                    name: 'Player '+playerCompt,
                    id:playerCompt
                });
            }
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

                for(var j=0, len3=numberOfPlayerPerTeam; j < len3; j++){
                    group.teams[i]['players'].push({
                        name: 'Player '+playerCompt++,
                        id:playerCompt
                    });
                }
            }
            groups.push(group);
            $scope.groups = groups;
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

    $scope.switchPlayers = function(group){
        var groupPlayers = [];

        for(var i=0, len=group.teams.length; i<len;i++){
            var team = group.teams[i];
            groupPlayers = groupPlayers.concat(team.players);
        }
        shuffle(groupPlayers);
        for(var i=0, len=group.teams.length; i<len;i++){
            var team = group.teams[i];
            team.players = [];
            for(var j=0; j<numberOfPlayerPerTeam;j++){     
                team.players.push(groupPlayers.pop());
            }
        }
    }

    $scope.random = function(){
        var groupPlayers = [];

        for(var a=0, length=groups.length;a<length;a++){
            for(var i=0, len=groups[a]['teams'].length; i<len;i++){
                var team = groups[a]['teams'][i];
                groupPlayers = groupPlayers.concat(team.players);
            }
        }
        shuffle(groupPlayers);
        for(var a=0, length=groups.length;a<length;a++){
            for(var i=0, len=groups[a]['teams'].length; i<len;i++){
                var team = groups[a]['teams'][i];
                team.players = [];
                for(var j=0; j<numberOfPlayerPerTeam;j++){
                    team.players.push(groupPlayers.pop());
                }
            }
        }
        $scope.groups = groups;
    }

    
    $scope.switchTeam = function(){
        console.log('random',groups);

        var listTeams = [];

        for(var a=0, length=groups.length;a<length;a++){
            listTeams = listTeams.concat(groups[a]['teams']);
        }
        shuffle(listTeams);
        console.log('sam',listTeams);
        
        for(var a=0, length=groups.length;a<length;a++){
            for(var i=0, len=groups[a]['teams'].length; i<len;i++){
                groups[a]['teams'][i] = listTeams.pop();
            }
        }
        console.log('sss',groups);
        $scope.groups = groups;
    }


});
