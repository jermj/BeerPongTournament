'use strict';

angular.module('beerPongTournamentApp')
.controller('GroupsCtrl', function ($scope,$location,Tournament) {

    var nbrOfCupsToWin = Tournament.getNumberOfCupsToWin(),
        numberOfGames = 0;

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
        var previousResult = Tournament.getGroupsResult();
        $scope.groups = previousResult;

        console.log('calculate number of games',previousResult);
        //TODO calculate numberOfGames if 0 $scope.showNextStep = true;
        //for each groups
        for(var y=0, len=previousResult.length; y<len; y++){
            //for each rounds per group
            for(var j=0, len2=previousResult[y]['rounds'].length; j<len2; j++){
                //for each game in a round
                for(var a= 0, len3 = previousResult[y]['rounds'][j].length; a< len3; a++){
                    if(previousResult[y]['rounds'][j][a]['winner'] <0){
                        numberOfGames++;
                    }
                }
            }
        }
        
        
        if(numberOfGames === 0){
            $scope.showNextStep = true;
        }
    }
    else{

        var planning = [],
            groups = Tournament.getTeams();

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

                    var team1 = [], team2 = [];

                    for(var a= 0, len4 = teamsArray[y]['players'].length; a< len4; a++){
                        teamsArray[y]['players'][a]['score'] = 0;
                        team1.push(angular.copy(teamsArray[y]['players'][a]));

                        teamsArray[j]['players'][a]['score'] = 0;
                        team2.push(angular.copy(teamsArray[j]['players'][a]));
                    }

                    matchs.push({
                        priority: 0,
                        match: [y,j],
                        title:teamsArray[y]['name']+' vs '+teamsArray[j]['name'],
                        score:[0,0],
                        scorers:[team1,team2],
                        winner:-1
                    });
                }
            }


            numberOfGames += matchs.length;

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

            planning.push(group);
        }

        $scope.groups = planning;
        Tournament.setGroupsResult($scope.groups);
    }






    $scope.setWinner = function(match,winner){
        console.log('setWinner',match,winner);

        if(match.winner === -1){
            numberOfGames--;
            if(numberOfGames == 0){
                $scope.showNextStep = true;
            }
        }
        match.winner = winner;
    }

    $scope.scoreUp = function(player, score,index){
        console.log('scope up',nbrOfCupsToWin,score[index],numberOfGames);
        if(score[index] < nbrOfCupsToWin){
            var scoreBeforeUp = score[index];
            score[index] = score[index] +1;
            player.score = player.score ? player.score + 1 : 1;
            Tournament.setGroupsResult($scope.groups);
        }
    }

    $scope.scoreDown = function(player, score,index,game){
        console.log('score down',player,score,numberOfGames);
        if(player.score >0){
            if(game.winner === index){
                game.winner = -1;
                numberOfGames++;
            }
            score[index] = score[index] -1;
            player.score = player.score - 1;
            Tournament.setGroupsResult($scope.groups);
        }
    }

    $scope.goNextStep = function(){
        console.log('go tables');
        Tournament.setGroupsResult($scope.groups);
        $location.path('/tables/1');
    }

});
