'use strict';

angular
.module('beerPongTournamentApp', [
    'ngRoute',
    'LocalStorageModule'
])
.config(["$routeProvider", function ($routeProvider) {
    $routeProvider
    .when('/', {
        templateUrl: 'views/home.html',
        controller: 'HomeCtrl'
    })
    .when('/selectTournament', {
        templateUrl: 'views/selecttournament.html',
        controller: 'SelectTournamentCtrl'
    })
    .when('/teamNaming', {
        templateUrl: 'views/teamnaming.html',
        controller: 'TeamNamingCtrl'
    })
    .when('/groups', {
        templateUrl: 'views/groups.html',
        controller: 'GroupsCtrl'
    })
    .when('/playoffs/:round', {
        templateUrl: 'views/playoffs.html',
        controller: 'PlayoffsCtrl'
    })
    .when('/tables', {
        templateUrl: 'views/tables.html',
        controller: 'TablesCtrl'
    })
    .when('/winner', {
        templateUrl: 'views/winner.html',
        controller: 'WinnerCtrl'
    })
    .otherwise({
        redirectTo: '/'
    });

}]);

'use strict';

angular.module('beerPongTournamentApp')
  .controller('HomeCtrl', ["$scope", function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  }]);

'use strict';

angular.module('beerPongTournamentApp')
  .controller('MainCtrl', ["$scope", function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  }]);

'use strict';

angular.module('beerPongTournamentApp')
.controller('SelectTournamentCtrl', ["$scope", "$location", "GroupEngine", "Tournament", "constants", function ($scope,$location,GroupEngine,Tournament,constants) {

    
    var nbrOfPlayers;

    $scope.callAlgo = function(numberOfPlayers){

        //TODO buffer 300ms

        nbrOfPlayers = numberOfPlayers;
        $scope.showPlayoffs = false;

        var configs = GroupEngine.getGroupFromNumberOfPlayers(numberOfPlayers);

        $scope.groupsSelect = [];

        for(var x=0, len=configs.length; x < len; x++){
            for(var y=0, len2=configs[x]['configurations'].length; y < len2; y++){
                //direct tournament
                if(configs[x]['configurations'][y]['directTournament']){
                    $scope.groupsSelect.push({
                        separator:'team of '+configs[x]['numberOfPlayers'],
                        value:'Direct tournament from '+constants.PLAYOFF_NAME[configs[x]['configurations'][y]['step']],
                        directTournament:1,
                        step:configs[x]['configurations'][y]['step'],
                        playersPerTeam:configs[x]['numberOfPlayers'],
                        numberOfTeams: +Math.pow(2, 1+configs[x]['configurations'][y]['step'])
                    });
                }
                //group(s) whith potential playoffs
                else{

                    var playoffs=[];
                    if(configs[x]['configurations'][y]['nbrOfGroups'] === 1){
                        playoffs.push({
                            step:-1,
                            value:'simple championship'
                        });
                    }
                    for(var i=0, len3=configs[x]['configurations'][y]['playOffStepMin'].length; i < len3; i++){
                        playoffs.push({
                            step:configs[x]['configurations'][y]['playOffStepMin'][i],
                            value: constants.PLAYOFF_NAME[configs[x]['configurations'][y]['playOffStepMin'][i]]
                        });
                    }

                    $scope.groupsSelect.push({
                        separator:'team of '+configs[x]['numberOfPlayers'],
                        playersPerTeam:configs[x]['numberOfPlayers'],
                        value:configs[x]['configurations'][y]['nbrOfGroups']+' group(s) of '+configs[x]['configurations'][y]['nbrOfTeam']+' teams',
                        playOffStepMin:configs[x]['configurations'][y]['playOffStepMin'],
                        playoffs:playoffs,
                        nbrOfGroups: configs[x]['configurations'][y]['nbrOfGroups'],
                        numberOfTeams:configs[x]['configurations'][y]['nbrOfTeam']
                    });
                }

            }
        }
    }


    $scope.goNextStep = function(configuration,playoff,numberOfCup){
        
        console.log('goNextStep',configuration,playoff,numberOfCup);
        
        Tournament.clearSettings();

        var params = {
            numberOfPlayers: nbrOfPlayers,
            numberOfGroups: configuration.nbrOfGroups,
            numberOfTeamsPerGroup: configuration.numberOfTeams,
            numberOfPlayerPerTeam: configuration.playersPerTeam,
            playoffStepAfterGroup: playoff ? playoff.step : undefined,
            isDirectTournament: configuration.directTournament,
            directTournamentStep: configuration.step,
            numberOfCupsToWin:numberOfCup
        }
        
        Tournament.init(params);
        $location.path('/teamNaming');
    }



}]);
'use strict';

angular.module('beerPongTournamentApp')
.controller('TeamNamingCtrl', ["$scope", "$location", "Tournament", function ($scope,$location,Tournament) {

    var numberOfGroups = Tournament.getNumberOfGroups(),
        numberOfTeamsPerGroup = Tournament.getNumberOfTeamsPerGroup(),
        numberOfPlayerPerTeam = Tournament.getNumberOfPlayerPerTeam(),
        isDirectTournament = Tournament.isADirectTournament(),
        groups=[],
        teamCompt =1,
        playerCompt =1;

    if(isDirectTournament){
        var group = {
            name: 'Direct Tournament',
            teams:[]
        };
        
        for(var y=0, len2=numberOfTeamsPerGroup; y < len2; y++){
            group.teams.push({
                name: 'Team '+teamCompt++,
                players: []
            });

            for(var z=0, len3=numberOfPlayerPerTeam; z < len3; z++){
                group.teams[y]['players'].push({
                    name: 'Player '+playerCompt++,
                });
            }
        }
        groups.push(group);
        $scope.groups = groups;
    }
    else{
        for(var x=0, len=numberOfGroups; x < len; x++){
            var group = {
                name: 'GROUP '+ String.fromCharCode(65 + x), //97 lowercase
                teams:[]
            }
            for(var y=0, len2=numberOfTeamsPerGroup; y < len2; y++){
                group.teams.push({
                    name: 'Team '+teamCompt++,
                    players: []
                });

                for(var z=0, len3=numberOfPlayerPerTeam; z < len3; z++){
                    group.teams[y]['players'].push({
                        name: 'Player '+playerCompt++,
                    });
                }
            }
            groups.push(group);
            $scope.groups = groups;
        }
    }


    console.log('groups',groups);

    $scope.startTournament = function(){
        Tournament.setTeams($scope.groups); 
        if(isDirectTournament){
            $location.path('/playoffs/0');
        }
        else{
            $location.path('/groups');
        }
        
    }


}]);

'use strict';

angular.module('beerPongTournamentApp')
.controller('PlayoffsCtrl', ["$scope", "$location", "$routeParams", "Tournament", "constants", function ($scope,$location,$routeParams,Tournament,constants) {

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


}]);

'use strict';

angular.module('beerPongTournamentApp')
.controller('GroupsCtrl', ["$scope", "$location", "Tournament", function ($scope,$location,Tournament) {

    var nbrOfCupsToWin = Tournament.getNumberOfCupsToWin();

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
        $scope.groups = Tournament.getGroupsResult();

        console.log($scope.groups);
        //TODO calculate numberOfGames if 0 $scope.showNextStep = true;
        $scope.showNextStep = true;
    }
    else{

        var planning = [],
            numberOfGames = 0,
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
        }
    }

    $scope.goNextStep = function(){
        Tournament.setGroupsResult($scope.groups);
        $location.path('/tables');
    }

}]);

'use strict';

angular.module('beerPongTournamentApp')
.controller('TablesCtrl', ["$scope", "$location", "Tournament", function ($scope,$location,Tournament) {

    var stepPlayoff = Tournament.getPlayoffStepAfterGroup(),
        tables = Tournament.getTables(),
        teams = Tournament.getTeams();

    $scope.tables = tables;

    //playoff
    if(stepPlayoff >-1){
        var nbrOfGroups = Tournament.getNumberOfGroups(),
            numberOfTeamsQualifiedPerGroups = Math.pow(2,stepPlayoff+1)/nbrOfGroups;

        $scope.numberOfTeamsQualifiedPerGroups = numberOfTeamsQualifiedPerGroups;

        //set teams for playoffs
        //Tournament.SetTeamsQualifiedForPlayoff();

        var teamsQualified = [],
            tmpTeams = angular.copy(teams);

        console.log('teams',teams,tables);

        for(var i = 0; i< teams.length; i++){
            for(var j = 0; j<numberOfTeamsQualifiedPerGroups;j++){
                var a = tmpTeams[i]['teams'].length;
                while( a-- ) {
                    if( tmpTeams[i]['teams'][a]['name'] === tables[i]['table'][j]['name']){
                        teamsQualified.push(tmpTeams[i]['teams'][a]);
                        break;
                    }
                }
                
            }
        }

        Tournament.SetTeamsQualifiedForPlayoff(teamsQualified);
        console.log('teamsQualified',teamsQualified);

        $scope.goNextStep = function(){
            $location.path('/playoffs/0');
        }
    }
    //simple championship = only 1 group
    else{
        alert('game finish');
    }

}]);

'use strict';

angular.module('beerPongTournamentApp')
  .controller('WinnerCtrl', ["$scope", function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  }]);

'use strict';

angular.module('beerPongTournamentApp')
.factory('GroupEngine', function GroupEngine() {

    function isEven(value){
        return value % 2 == 0;             
    }

    function canBeADirectTournament(value){
        var data = Math.log(value)/Math.log(2); 
        return data === parseInt(data);
    }


    function algo(numberOfPlayers){

        var result = [];

        /* tournoi directe sans poules*/
        if(canBeADirectTournament(numberOfPlayers)){
            result.push(
                {
                    directTournament:1,
                    step: Math.log(numberOfPlayers/2)/Math.log(2) //0 final, 1 semi, 2 quarter...
                }
            );
        }

        var numberOfPlayersCouldBeDivisableInMoreGroups = true,
            compt = 0;

        /* championnat avec poules*/
        while(numberOfPlayersCouldBeDivisableInMoreGroups){
            var nbrOfTeam = numberOfPlayers/Math.pow(2,compt);

            /* On peut faire x groupe de y joueurs*/
            if(nbrOfTeam === parseInt(nbrOfTeam) && nbrOfTeam > 2){

                var nbrGroups = Math.pow(2,compt);

                /* joueurs qualifiés en playoff = forcément au moins un perdant par poule */
                var potentialNbrOfPlayerInPlayoff = numberOfPlayers - nbrGroups,
                    round = Math.floor(Math.log(potentialNbrOfPlayerInPlayoff)/Math.log(2)),
                    exactNbrOfPlayerInPlayoff = Math.pow(2,round),
                    canBeMakeAnOtherRound = true,
                    puissance = 0,
                    playOffStepMin = [];


                /* 1 poules = au moins finale; 2 poules = au moins finales; 4 poules = au moins demi , 8 poules = au moins quart ... */
                while(canBeMakeAnOtherRound){
                    if(nbrGroups < 3 && 2*Math.pow(2,puissance) <= exactNbrOfPlayerInPlayoff){
                        playOffStepMin.push(Math.log(Math.pow(2,puissance))/Math.log(2));

                        puissance++;
                    }
                    else if(nbrGroups > 2 && nbrGroups*Math.pow(2,puissance) <= exactNbrOfPlayerInPlayoff){
                        playOffStepMin.push(Math.log(nbrGroups*Math.pow(2,puissance)/2)/Math.log(2));
                        puissance++;
                    }
                    else{
                        canBeMakeAnOtherRound = false
                    }
                }

                result.push(
                    {
                        nbrOfGroups:nbrGroups,
                        nbrOfTeam: nbrOfTeam,
                        playOffStepMin: playOffStepMin
                    }
                );

                compt++;
            }else{
                numberOfPlayersCouldBeDivisableInMoreGroups = false;
            }
        }

        return result;
    }

    var api = {};

    api.getGroupFromNumberOfPlayers = function(numberOfPlayers){

        var result = [];

        /* equipe de 1 */
        if(numberOfPlayers > 1){
            var category = {
                numberOfPlayers:1,
                configurations:[]
            };
            category.configurations = algo(numberOfPlayers);
            result.push(category);
        }

        /* equipe de 2 */
        if(numberOfPlayers % 2 == 0 && numberOfPlayers > 4){
            var category = {
                numberOfPlayers:2,
                configurations:[]
            };
            category.configurations = algo(numberOfPlayers/2);
            result.push(category);
        }

        /* equipe de 3 */
        if(numberOfPlayers % 3 == 0 && numberOfPlayers > 6){
            var category = {
                numberOfPlayers:3,
                configurations:[]
            };
            category.configurations = algo(numberOfPlayers/3);
            result.push(category);
        }


        return result;
    }


    return api;

});

'use strict';

angular.module('beerPongTournamentApp')
.service('Tournament', ["localStorageService", function Tournament(localStorageService) {
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
        
        tournamentSettings = teams = groupResult = playoffs = null;
    }

    this.init = function(params){
        localStorageService.set('tournamentSettings',params);
        console.log(params);
        tournamentSettings = params;
        console.log('sam',params);
    }

    this.isADirectTournament = function(){
        return tournamentSettings.isDirectTournament;
    }

    this.getNumberOfGroups = function(){
        return tournamentSettings.numberOfGroups;
    }
    this.getDirectTournamentStep = function(){
        return tournamentSettings.directTournamentStep;
    }
    this.getNumberOfTeamsPerGroup = function(){
        return tournamentSettings.numberOfTeamsPerGroup;
    }

    this.getNumberOfPlayerPerTeam = function(){
        return tournamentSettings.numberOfPlayerPerTeam;
    }

    this.setTeams = function(params){
        console.log('setTeams',params);
        teams = params;
        localStorageService.set('teams',params);
    }

    this.getTeams = function(){
        console.log('getTeams',teams);
        return teams;
    }


    this.SetTeamsQualifiedForPlayoff = function(teamsQualified){
        playoffs = [{teams: teamsQualified}];
        localStorageService.set('playoffs',playoffs);
    }
    
    this.setPlayoffs = function(params){
        localStorageService.set('playoffs',params);
        playoffs = params;
    }

    this.getPlayoffs = function(){

        if(playoffs){
            return playoffs;
        }
        else{
            return [{teams: teams[0]['teams']}];
        }

    }

    this.getNumberOfCupsToWin = function(){
        return tournamentSettings.numberOfCupsToWin;
    }

    this.getPlayoffStepAfterGroup = function(){
        return tournamentSettings.playoffStepAfterGroup;
    }

    this.getGroupsResult = function(){
            return groupResult;
    }
    
    this.setGroupsResult = function(gpResult){
        localStorageService.set('groupResult',gpResult);
        groupResult = gpResult;
    }

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

        console.log(groupResult);

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
                }
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
            })
            tables.push(group);
        }
        return tables;
    }

}]);

'use strict';

angular.module('beerPongTournamentApp')
  .constant('constants', {
    PLAYOFF_NAME:['final', 'semi-final', 'quarter-final','16nd round', '32nd round', '64nd round']
  });
