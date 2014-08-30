'use strict';

angular.module('beerPongTournamentApp')
.controller('GroupsCtrl', function ($scope,$location,Tournament) {

    var nbrOfCupsToWin = Tournament.getNumberOfCupsToWin(),
        numberOfGames = 0,
        gameId=0;

    $scope.nbrOfCupsToWin = nbrOfCupsToWin;
    $scope.showNextStep = false;

    function updatePriorities(array, game, games){
        for(var i=0, len=array.length; i<len; i++){
            array[i] = (i === game[0] || i === game[1]) ? 0 : array[i]+1;
        }
        for(var j=0, len2=games.length; j<len2; j++){
            games[j]['priority'] = array[games[j]['match'][0]] + array[games[j]['match'][1]];
        }
        games.sort(function(a,b){return b.priority - a.priority;});
    }

    if(Tournament.getGroupsResult()){
        $scope.numberOfGamesTotal = 0;
        var previousResult = Tournament.getGroupsResult();
        $scope.groups = previousResult;

        for(var k=0, len3=previousResult.length; k<len3; k++){
            //for each rounds per group
            for(var l=0, len4=previousResult[k]['rounds'].length; l<len4; l++){
                //for each game in a round
                for(var a= 0, len5 = previousResult[k]['rounds'][l].length; a< len5; a++){
                    if(previousResult[k]['rounds'][l][a]['winner'] <0){
                        numberOfGames++;
                    }
                    $scope.numberOfGamesTotal++;
                }
            }
        }

        $scope.numberOfGames = numberOfGames;
        if(numberOfGames === 0){
            $scope.showNextStep = true;
        }
    }
    else{

        var planning = [],
            groups = Tournament.getTeams();

        //for each groups
        for(var b=0, len6=groups.length; b < len6; b++){
            var group = groups[b],
                teamsArray = groups[b]['teams'],
                numberOfTeamPerGroup = teamsArray.length;


            var matchs = [],
                priorities = [];

            for(var c=0, len7=teamsArray.length; c<len7; c++){
                priorities.push(0);
            }

            //generate each match between every teams
            for(var d=1, len8=teamsArray.length; d<len8; d++){
                for(var e=0; e<=d-1; e++){
                    var playersHome = [], playersAway = [],
                        numberOfPlayerTeamHome =  teamsArray[d]['players'].length,
                        numberOfPlayerTeamAway =  teamsArray[e]['players'].length;

                    for(var l=0, len4 = Math.max(numberOfPlayerTeamHome, numberOfPlayerTeamAway); l<len4; l++){
                        if(l<numberOfPlayerTeamHome){
                            teamsArray[d]['players'][l]['score'] = 0;
                            playersHome.push(angular.copy(teamsArray[d]['players'][l]));
                        }
                        if(l<numberOfPlayerTeamAway){
                            teamsArray[e]['players'][l]['score'] = 0;
                            playersAway.push(angular.copy(teamsArray[e]['players'][l]));
                        }
                    }


                    matchs.push({
                        priority: 0,
                        match: [d,e],
                        title:teamsArray[d]['name']+' vs '+teamsArray[e]['name'],
                        score:[0,0],
                        scorers:[playersHome,playersAway],
                        winner:-1,
                        id:gameId++
                    });
                }
            }


            numberOfGames += matchs.length;         
            $scope.numberOfGamesTotal = numberOfGames;
            $scope.numberOfGames = numberOfGames;

            group.rounds = [];

            while(matchs.length >0){
                var round = [];
                for(var g =0, len10 = Math.floor(numberOfTeamPerGroup/2); g < len10; g++){
                    var shiftMatch = matchs.shift();
                    round.push(shiftMatch);
                    updatePriorities(priorities, shiftMatch.match, matchs);
                }
                group.rounds.push(round);
            }

            planning.push(group);
        }

        $scope.groups = planning;
        Tournament.setGroupsResult($scope.groups);
    }

    $scope.setWinner = function(match,winner){
        if(match.winner === -1){
            numberOfGames--;
            $scope.numberOfGames = numberOfGames;
            if(numberOfGames === 0){
                $scope.showNextStep = true;
            }
        }
        match.winner = winner;
        Tournament.setGroupsResult($scope.groups);
    };

    $scope.scoreUp = function(player, score,index){
        if(score[index] < nbrOfCupsToWin){
            score[index] = score[index] +1;
            player.score = player.score ? player.score + 1 : 1;
            Tournament.setGroupsResult($scope.groups);
        }
    };

    $scope.scoreDown = function(player, score,index,game){
        if(player.score >0){
            if(game.winner === index){
                game.winner = -1;
                numberOfGames++;
                $scope.numberOfGames = numberOfGames;
            }
            score[index] = score[index] -1;
            player.score = player.score - 1;
            Tournament.setGroupsResult($scope.groups);
        }
    };

    $scope.goNextStep = function(){
        Tournament.setGroupsResult($scope.groups);
        $location.path('/tables/1');
    };

});
