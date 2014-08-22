'use strict';

angular.module('beerPongTournamentApp')
.controller('ScorersCtrl', function ($scope,Tournament) {

    $scope.scorers = Tournament.getScorers();

    var teams = Tournament.getTeams(),
        listOfGroup = [],
        listOfTeams = [];

    for(var i=0, len = teams.length; i<len; i++){
        var group = teams[i];
        listOfGroup.push(group.name);
        for(var j=0, len2 = group.teams.length; j<len2; j++){
            var team = group.teams[j];
            listOfTeams.push(team.name);
        }
    }
    
    $scope.filterTypes = [listOfGroup,listOfTeams];

});
