'use strict';

angular.module('beerPongTournamentApp')
.controller('PlayoffsCtrl', function ($scope,$location,$routeParams,Tournament,constants) {

    var playoffs = angular.copy(Tournament.getPlayoffs()),        
        nbrOfCupsToWin = Tournament.getNumberOfCupsToWin(),
        round = $routeParams.round,
        numberOfTeams=playoffs[round]['teams'].length,
        step = Math.log(numberOfTeams)/Math.log(2)-1,
        numberOfGames = numberOfTeams/2,
        gameId=0;

    $scope.nbrOfCupsToWin = nbrOfCupsToWin;

    $scope.title = constants.PLAYOFF_NAME[step];

    if(playoffs[round]['result']){
        $scope.games = playoffs[round]['result'];

        for(var j = 0, len2 = playoffs[round]['result'].length; j < len2; j++){
            var game = playoffs[round]['result'][j];
            if(game.winner > -1){
                numberOfGames--;
            }
        }
        if(numberOfGames === 0){
            $scope.showNextStep = true;
        }

    }
    else{
        var potentialTeams = angular.copy(playoffs[round]['teams']),
            games = [];


        for(var i = 0, len = numberOfGames; i<len;i++){
            var indexHome, indexAway, teamHome, teamAway;

            indexHome = Math.floor((Math.random() * potentialTeams.length));
            teamHome = potentialTeams[indexHome];
            potentialTeams.splice(indexHome, 1);

            indexAway = Math.floor((Math.random() * potentialTeams.length));
            teamAway = potentialTeams[indexAway];
            potentialTeams.splice(indexAway, 1);

            var playersHome = [], playersAway = [],
                numberOfPlayerTeamHome = teamHome.players.length,
                numberOfPlayerTeamAway = teamAway.players.length;

            for(var l=0, len4 = Math.max(numberOfPlayerTeamHome, numberOfPlayerTeamAway); l<len4; l++){
                if(l<numberOfPlayerTeamHome){
                    teamHome.players[l]['score'] = 0;
                    playersHome.push(angular.copy(teamHome.players[l]));
                }
                if(l<numberOfPlayerTeamAway){
                    teamAway.players[l]['score'] = 0;
                    playersAway.push(angular.copy(teamAway.players[l]));
                }
            }

            games.push({
                title:teamHome.name+' vs '+teamAway.name,
                match:[teamHome,teamAway],
                score: [ 0, 0 ],
                scorers: [playersHome,playersAway],
                winner: -1,
                id:gameId++
            });
        }

        $scope.games = games;
    }

    $scope.setWinner = function(match,winner){

        if(match.winner === -1){
            numberOfGames--;
            if(numberOfGames === 0){
                $scope.showNextStep = true;
            }
        }
        match.winner = winner;
        playoffs[round].result = $scope.games;
        Tournament.setPlayoffs(playoffs);
    };



    $scope.scoreUp = function(player, score,index){
        if(score[index] < nbrOfCupsToWin){
            score[index] = score[index] +1;
            player.score = player.score ? player.score + 1 : 1;

            playoffs[round].result = $scope.games;
            Tournament.setPlayoffs(playoffs);
        }
    };

    $scope.scoreDown = function(player, score,index,game){
        if(player.score >0){
            if(game.winner === index){
                game.winner = -1;
                numberOfGames++;
            }
            score[index] = score[index] -1;
            player.score = player.score - 1;

            playoffs[round].result = $scope.games;
            console.log('score down', playoffs);
            Tournament.setPlayoffs(playoffs);
        }
    };

    $scope.goNextStep = function(){
        playoffs[round].result = $scope.games;
        var teamsQualified = [],
            nextRound = parseInt(round) +1;

        for(var j = 0, len2 = playoffs[round]['result'].length; j < len2; j++){
            if(playoffs[round]['result'][j]['score'][0] === nbrOfCupsToWin){
                teamsQualified.push(playoffs[round]['result'][j]['match'][0]);
            }
            else{
                teamsQualified.push(playoffs[round]['result'][j]['match'][1]);
            }
        }
        playoffs.push({teams:teamsQualified});
        Tournament.setPlayoffs(playoffs);
        if(teamsQualified.length>1){
            $location.path('/playoffs/'+nextRound);
        }
        else{
            $location.path('/winner');
        }
    };


});
