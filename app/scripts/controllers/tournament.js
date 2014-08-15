'use strict';

angular.module('beerPongTournamentApp')
.controller('TournamentCtrl', function ($scope,Tournament) {

    var groups = Tournament.getTeams(),
        nbrOfCupsToWin = Tournament.getNumberOfCupsToWin();

    console.log('groups',groups);

    //if direct tournament
    //random by 2 team

    //else
    //for each group 
    // generate as game as team by group

    function updatePriorities(array, game, games){
        for(var i=0, len=array.length; i<len; i++){
            array[i] = (i === game[0] || i === game[1]) ? 0 : array[i]+1;
        }
        for(var j=0, len2=games.length; j<len2; j++){
            games[j]['priority'] = array[games[j]['match'][0]] + array[games[j]['match'][1]];
        }
        games.sort(function(a,b){return b.priority - a.priority;});
    }


    if(Tournament.isADirectTournament()){
        //TODO
    }
    else{
        console.log('not a direct tournament');

        var planning = [];

        for(var x=0, len=groups.length; x < len; x++){
            var group = groups[x],
                teamsArray = groups[x]['teams'],
                numberOfTeamPerGroup = teamsArray.length;

            console.log('group', groups[x]);

            var matchs = [],
                priorities = [];

            for(var i=0, len2=teamsArray.length; i<len2; i++){
                priorities.push(0);
            }

            for(var y=1, len3=teamsArray.length; y<len3; y++){
                for(var j=0; j<=y-1; j++){
                    matchs.push({priority: 0, match: [y,j], title:teamsArray[y]['name']+' vs '+teamsArray[j]['name']});
                }
            }

            group.rounds = [];

            while(matchs.length >0){
                var round = [];
                for(var a =0, length1 = Math.floor(numberOfTeamPerGroup/2); a < length1; a++){
                    var shiftMatch = matchs.shift();
                    round.push(shiftMatch);
                    updatePriorities(priorities, shiftMatch.match, matchs);
                }
                group.rounds.push(round);
            }

            console.log('group round planned',group.rounds);

            //TODO : split gameScheduled by round and make a big JSON

            planning.push(group);
        }

        
        $scope.groups = planning;
        console.log('final planning',planning);

    }
    
    $scope.scoreUp = function(player, score,index){
        console.log(player,score);
        if(score[index] < nbrOfCupsToWin){
            score[index] = score[index] +1;
            player.score = player.score ? player.score + 1 : 1;
        }
        console.log(score);
    }
    
    $scope.scoreDown = function(player, score,index){
        console.log(player,score);
        if(player.score >0){
            score[index] = score[index] -1;
            player.score = player.score - 1;
        }
        console.log(score);
    }


});