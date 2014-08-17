'use strict';

angular.module('beerPongTournamentApp')
.controller('PlayoffsCtrl', function ($scope,$location,$routeParams,Tournament,constants) {

    var playoffs = Tournament.getPlayoffs(),        
        nbrOfCupsToWin = Tournament.getNumberOfCupsToWin(),
        round = $routeParams.round,
        step = Math.log(playoffs[round]['teams'].length)/Math.log(2)-1,
        numberOfGames = playoffs[round]['teams'].length/2;
    
    $scope.nbrOfCupsToWin = nbrOfCupsToWin;

    $scope.title = constants.PLAYOFF_NAME[step];

    console.log('playoffs',playoffs);
    
    if(playoffs[round]['result']){
        $scope.games = playoffs[round]['result'];
        
        console.log(playoffs[round]['result']);
        for(var j = 0, len2 = playoffs[round]['result'].length; j < len2; j++){
            if(playoffs[round]['result'][j]['score'][0] === nbrOfCupsToWin || playoffs[round]['result'][j]['match'][1] === nbrOfCupsToWin){
                numberOfGames--;
            }
        }
        if(numberOfGames === 0){
            $scope.showNextStep = true;
        }

    }
    else{
        var potentialTeams = playoffs[round]['teams'],
            games = [];
            

    for(var i = 0, len = numberOfGames; i<len;i++){
        var index1, index2, team1, team2;

        index1 = Math.floor((Math.random() * potentialTeams.length));
        team1 = potentialTeams[index1];
        potentialTeams.splice(index1, 1);

        index2 = Math.floor((Math.random() * potentialTeams.length));
        team2 = potentialTeams[index2];
        potentialTeams.splice(index2, 1);

        games.push({
            title:team1.name+' vs '+team2.name,
            match:[team1,team2],
            score: [ 0, 0 ],
            scorers: [[],[]],
            winner: -1
        })
    }

        $scope.games = games;
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
        console.log('scope up',player, score,index);
        if(score[index] < nbrOfCupsToWin){
            var scoreBeforeUp = score[index];
            score[index] = score[index] +1;
            player.score = player.score ? player.score + 1 : 1;
        }
    }

    $scope.scoreDown = function(player, score,index,game){
        console.log('score down',player,score,numberOfGames,game);
        if(player.score >0){
            if(game.winner === index){
                game.winner = -1;
                numberOfGames++;
            }
            score[index] = score[index] -1;
            player.score = player.score - 1;
        }
    }

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
    }


});
