'use strict';

angular.module('beerPongTournamentApp')
.controller('PlayoffsCtrl', function ($scope,$location,$routeParams,Tournament,constants) {

    var playoffs = angular.copy(Tournament.getPlayoffs()),        
        nbrOfCupsToWin = Tournament.getNumberOfCupsToWin(),
        round = $routeParams.round,
        step,
        numberOfGames = 0,
        gameId=0;

    $scope.nbrOfCupsToWin = nbrOfCupsToWin;

    //refreshed page
    if(playoffs[round]['result']){
        numberOfGames = playoffs[round]['result'].length;
        step = Math.log(numberOfGames)/Math.log(2);
        $scope.title = constants.PLAYOFF_NAME[step];
        
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
    //first load of the page
    else{
        var divisions = angular.copy(playoffs[round]['divisions']),
            games = [];

        var divisionHome,
            divisionAway,
            nbrOfGamesPerDivision,
            index;

        for(var i=0,len=divisions.length;i<len/2;i++){

            //only one group
            if(divisions.length === 1){
                divisionHome = divisions[0];
                divisionAway = divisions[0];
                nbrOfGamesPerDivision = divisionHome.teams.length/2;
                index = divisionHome.teams.length;
            }
            //more than one group
            else{
                divisionHome = divisions[i*2];
                divisionAway = divisions[i*2+1];
                nbrOfGamesPerDivision = divisionHome.teams.length;
                index = divisionHome.teams.length;
            }

            for(var j=0;j<nbrOfGamesPerDivision;j++){
                var teamHome = divisionHome.teams[j],
                    teamAway = divisionAway.teams[index-j-1];

                numberOfGames++;
                
                
                var playersHome = [], playersAway = [],
                        numberOfPlayerTeamHome =  teamHome.players.length,
                        numberOfPlayerTeamAway =  teamAway.players.length;

                    for(var l=0, len4 = Math.max(numberOfPlayerTeamHome, numberOfPlayerTeamAway); l<len4; l++){
                        if(l<numberOfPlayerTeamHome){
                            teamHome.players[l]['score'] = 0;
                            playersHome.push(angular.copy(teamHome.players[l]));
                        }
                        if(l<numberOfPlayerTeamAway){
                            teamAway.players[l]['score'] = 0;
                            playersAway.push(angular.copy(teamAway.players  [l]));
                        }
                    }

                games.push({
                    title:teamHome.name+' vs '+teamAway.name,
                    match:[teamHome,teamAway],
                    score: [ 0, 0 ],
                    scorers: [teamHome.players,teamAway.players],
                    winner: -1,
                    id:gameId++
                });
            }
        }



        /*
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
        */

        step = Math.log(numberOfGames)/Math.log(2);
        $scope.title = constants.PLAYOFF_NAME[step];
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

        playoffs.push({divisions:[{teams:teamsQualified}]});
        
        Tournament.setPlayoffs(playoffs);
        if(teamsQualified.length>1){
            $location.path('/playoffs/'+nextRound);
        }
        else{
            Tournament.setWinner(teamsQualified[0]);
            $location.path('/winner');
        }
    };


});
