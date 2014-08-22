'use strict';

angular.module('beerPongTournamentApp')
.service('Tournament', function Tournament(localStorageService) {
    // AngularJS will instantiate a singleton by calling "new" on this function

    /*
        isDirectTournament: boolean
        directTournamentStep: number
        numberOfGroups: number
        numberOfPlayerPerTeam: number
        numberOfPlayers: number
        numberOfTeamsPerGroup: number
        playoffStepAfterGroup: number
        numberOfCupsToWin: number        
      */
    var tournamentSettings = localStorageService.get('tournamentSettings') || false,
        teams = localStorageService.get('teams') || false,
        groupResult = localStorageService.get('groupResult') || false,
        playoffs = localStorageService.get('playoffs') || false,
        winner = localStorageService.get('winner') || false;

    this.clearSettings = function(){
        localStorageService.clearAll();

        winner = tournamentSettings = teams = groupResult = playoffs = false;
    };

    this.init = function(params){
        localStorageService.set('tournamentSettings',params);
        tournamentSettings = params;
    };

    this.isADirectTournament = function(){
        return tournamentSettings.isDirectTournament;
    };

    this.getNumberOfGroups = function(){
        return tournamentSettings.numberOfGroups;
    };
    this.getDirectTournamentStep = function(){
        return tournamentSettings.directTournamentStep;
    };
    this.getNumberOfTeamsPerGroup = function(){
        return tournamentSettings.numberOfTeamsPerGroup;
    };

    this.getNumberOfPlayerPerTeam = function(){
        return tournamentSettings.numberOfPlayerPerTeam;
    };

    this.setTeams = function(params){
        teams = params;
        localStorageService.set('teams',params);
    };

    this.getTeams = function(){
        return teams;
    };


    this.SetTeamsQualifiedForPlayoff = function(teamsQualified){
        playoffs = [{teams: teamsQualified}];
        localStorageService.set('playoffs',playoffs);
    };

    this.setPlayoffs = function(params){
        localStorageService.set('playoffs',params);
        playoffs = params;
    };

    this.getPlayoffs = function(){
        if(playoffs){
            return playoffs;
        }
        else{
            return [{teams: teams[0]['teams']}];
        }
    };

    this.getNumberOfCupsToWin = function(){
        return tournamentSettings.numberOfCupsToWin;
    };

    this.getPlayoffStepAfterGroup = function(){
        return tournamentSettings.playoffStepAfterGroup;
    };

    this.getGroupsResult = function(){
        return groupResult;
    };

    this.setGroupsResult = function(gpResult){
        localStorageService.set('groupResult',gpResult);
        groupResult = gpResult;
    };
    
    this.setWinner = function(team){
        localStorageService.set('winner',team);
        winner = team;
    };
    this.getWinner = function(team){
        return winner;
    };

    function updateTable(table,teamName,type,cupsFor,cupsAgainst){
        var i = table.length;
        while( i-- ) {
            if( table[i].name === teamName ){
                if(type === 'win'){
                    table[i]['win'] += 1;
                }
                else if(type === 'lose'){
                    table[i]['lose'] += 1;
                }
                table[i]['cupsFor'] += cupsFor;
                table[i]['cupsAgainst'] += cupsAgainst;
                break;
            } 
        }
    }

    this.getTables = function(){
        var tables = [];

        for(var i=0, len = groupResult.length; i<len; i++){
            var group = {
                name: groupResult[i]['name'],
                table:[]
            };

            for(var j=0, len2 = groupResult[i]['teams'].length; j<len2; j++){
                var team = {
                    name: groupResult[i]['teams'][j]['name'],
                    win:0,
                    lose:0,
                    cupsFor: 0,
                    cupsAgainst: 0
                };
                group.table.push(team);
            }

            for(var k=0, len3 = groupResult[i]['rounds'].length; k<len3; k++){
                for(var l=0, len4 = groupResult[i]['rounds'][k].length; l<len4; l++){
                    var game = groupResult[i]['rounds'][k][l];

                    //check if the match is ended = winner / looser
                    if(game.winner>-1){
                        var winner =game.winner,
                            looser = +!game.winner;
                        updateTable(group.table,groupResult[i]['teams'][game.match[winner]]['name'],'win',game.score[winner],game.score[looser]);
                        updateTable(group.table,groupResult[i]['teams'][game.match[looser]]['name'],'lose',game.score[looser],game.score[winner]);
                    }
                }
            }
            group.table.sort(function(a, b){
                if(b.win === a.win){
                    var golaverageA = a.cupsFor - a.cupsAgainst,
                        golaverageB = b.cupsFor - b.cupsAgainst;
                    if(golaverageB === golaverageA){
                        return a.cupsFor-b.cupsFor;
                    }
                    else{
                        return golaverageB-golaverageA;
                    }
                    
                }else{
                    return b.win-a.win;
                }


            });
            tables.push(group);
        }
        return tables;
    };

    function updateScore(scorers,playerId,score,victory){
        var i = scorers.length;
        while( i-- ) {
            if( scorers[i].id === playerId ){
                scorers[i]['score'] += score;
                scorers[i]['numberOfGame'] += 1;
                scorers[i]['win'] += +victory;

                break;
            } 
        }
    }

    this.getScorers = function(){
        var scorers = [];

        for(var i=0, len = teams.length; i<len; i++){
            var group = teams[i],
                groupName = teams[i]['name'];

            for(var j=0, len2 = group.teams.length; j<len2; j++){
                var team= teams[i]['teams'][j],
                    teamName = teams[i]['teams'][j]['name'];

                for(var k=0, len3 = team.players.length; k<len3; k++){
                    
                    
                    var player = team.players[k];
                    player.score = 0;
                    player.numberOfGame = 0;
                    player.groupName = groupName;
                    player.teamName = teamName;
                    player.win = 0;
                    player.winner = (winner && winner.name === teamName) ? 1 : 0;
                    scorers.push(player);
                }
            }
        }

        if(groupResult){
            for(var i=0, len = groupResult.length; i<len; i++){
                var group = groupResult[i];

                for(var j=0, len2 = group.rounds.length; j<len2; j++){
                    var round = group.rounds[j];

                    for(var k=0, len3 = round.length; k<len3; k++){
                        var match = round[k];

                        //if no winner, game is not already played
                        if(match.winner>-1){
                            //DON'T FORGET MANUAL MODE equip of 2 against equip of 4
                            var numberOfPlayerTeamHome = match.scorers[0].length,
                                numberOfPlayerTeamAway = match.scorers[1].length;

                            for(var l=0, len4 = Math.max(numberOfPlayerTeamHome, numberOfPlayerTeamAway); l<len4; l++){
                                if(l<numberOfPlayerTeamHome){
                                    var playerTeamHome = match.scorers[0][l];
                                    updateScore(scorers,playerTeamHome.id,playerTeamHome.score,match.winner===0);
                                }
                                if(l<numberOfPlayerTeamAway){
                                    var playerTeamAway = match.scorers[1][l];
                                    updateScore(scorers,playerTeamAway.id,playerTeamAway.score,match.winner===1);
                                }
                            }
                        }

                    }
                }
            }
        }

        if(playoffs){
            for(var i=0, len = playoffs.length; i<len; i++){
                var playoffRound= playoffs[i];

                //last element can be the winner so no attribut result
                if(playoffRound.result){
                    for(var j=0, len2 = playoffRound.result.length; j<len2; j++){
                        var match = playoffRound.result[j];

                        //if no winner, game is not already played
                        if(match.winner>-1){
                            //DON'T FORGET MANUAL MODE equip of 2 against equip of 4
                            var numberOfPlayerTeamHome = match.scorers[0].length,
                                numberOfPlayerTeamAway = match.scorers[1].length;

                            for(var l=0, len4 = Math.max(numberOfPlayerTeamHome, numberOfPlayerTeamAway); l<len4; l++){
                                if(l<numberOfPlayerTeamHome){
                                    var playerTeamHome = match.scorers[0][l];
                                    updateScore(scorers,playerTeamHome.id,playerTeamHome.score,match.winner===0);
                                }
                                if(l<numberOfPlayerTeamAway){
                                    var playerTeamAway = match.scorers[1][l];
                                    updateScore(scorers,playerTeamAway.id,playerTeamAway.score,match.winner===1);
                                }
                            }
                        }
                    }
                }


            }
        }

        scorers.sort(function(a, b){
            return b.score-a.score;
        });
        return scorers;
    };

});
