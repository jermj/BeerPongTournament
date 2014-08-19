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
    var tournamentSettings = localStorageService.get('tournamentSettings') || {},
        teams = localStorageService.get('teams') || {},
        groupResult = localStorageService.get('groupResult') || false,
        playoffs = localStorageService.get('playoffs') || false;
    
    this.clearSettings = function(){
        localStorageService.remove('tournamentSettings');
        localStorageService.remove('teams');
        localStorageService.remove('groupResult');
        localStorageService.remove('playoffs');
        
        tournamentSettings = teams = groupResult = playoffs = false;
    };

    this.init = function(params){
        localStorageService.set('tournamentSettings',params);
        console.log(params);
        tournamentSettings = params;
        console.log('sam',params);
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
        console.log('setTeams',params);
        teams = params;
        localStorageService.set('teams',params);
    };

    this.getTeams = function(){
        console.log('getTeams',teams);
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

        console.log('getTables',groupResult);

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
                // console.log(b.win-a.win);
                return b.win-a.win;
            });
            tables.push(group);
        }
        return tables;
    };

});
