'use strict';

angular.module('beerPongTournamentApp')
.service('Tournament', function Tournament(localStorageService) {
    // AngularJS will instantiate a singleton by calling "new" on this function

    /*
        isDirectTournament: boolean
        numberOfGroups: integer
        numberOfPlayerPerTeam: integer
        numberOfPlayers: integer
        numberOfTeamsPerGroup: integer
        playoffStepAfterGroup: integer
      */
    var tournamentSettings = localStorageService.get('tournamentSettings') || {},
        teams = localStorageService.get('teams') || {};

    this.init = function(params){
        localStorageService.set('tournamentSettings',params);
        console.log(params);
        tournamentSettings = params;
    }
    
    this.isADirectTournament = function(){
        return tournamentSettings.isDirectTournament;
    }

    this.getNumberOfGroups = function(){
        return tournamentSettings.numberOfGroups;
    }
    
    this.getNumberOfTeamsPerGroup = function(){
        return tournamentSettings.numberOfTeamsPerGroup;
    }

    this.getNumberOfPlayerPerTeam = function(){
        return tournamentSettings.numberOfPlayerPerTeam;
    }
    
    this.setTeams = function(params){
        localStorageService.set('teams',params);
        console.log(params);
        teams = params;
    }
    
    this.getTeams = function(){
        return teams;
    }
    
    this.getNumberOfCupsToWin = function(){
        return tournamentSettings.numberOfCupsToWin;
    }


});
