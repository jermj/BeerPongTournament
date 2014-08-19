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
    .when('/tables/:showButton', {
        templateUrl: 'views/tables.html',
        controller: 'TablesCtrl'
    })
    .when('/winner', {
        templateUrl: 'views/winner.html',
        controller: 'WinnerCtrl'
    })
    .when('/scorers', {
        templateUrl: 'views/scorers.html',
        controller: 'ScorersCtrl'
    })
    .otherwise({
        redirectTo: '/'
    });

}]);

'use strict';

angular.module('beerPongTournamentApp')
  .controller('HomeCtrl', ["$scope", "localStorageService", function ($scope,localStorageService) {
      
      $scope.lastTournament = localStorageService.get('tournamentPath');
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
    };


    $scope.goNextStep = function(configuration,playoff,numberOfCup){

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
        };

        Tournament.init(params);
        $location.path('/teamNaming');
    };



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
        playerCompt =1,
        group;

    if(isDirectTournament){
        group = {
            name: 'Direct Tournament',
            teams:[]
        };
        
        for(var y=0; y < numberOfTeamsPerGroup; y++){
            group.teams.push({
                name: 'Team '+teamCompt++,
                players: []
            });

            for(var z=0; z < numberOfPlayerPerTeam; z++){
                playerCompt++;
                group.teams[y]['players'].push({
                    name: 'Player '+playerCompt,
                    id:playerCompt
                });
            }
        }
        groups.push(group);
        $scope.groups = groups;
    }
    else{
        for(var x=0, len=numberOfGroups; x < len; x++){
            group = {
                name: 'GROUP '+ String.fromCharCode(65 + x), //97 lowercase
                teams:[]
            };
            for(var i=0, len2=numberOfTeamsPerGroup; i < len2; i++){
                group.teams.push({
                    name: 'Team '+teamCompt++,
                    players: []
                });

                for(var j=0, len3=numberOfPlayerPerTeam; j < len3; j++){
                    group.teams[i]['players'].push({
                        name: 'Player '+playerCompt++,
                        id:playerCompt
                    });
                }
            }
            groups.push(group);
            $scope.groups = groups;
        }
    }

    $scope.startTournament = function(){
        Tournament.setTeams($scope.groups); 
        if(isDirectTournament){
            $location.path('/playoffs/0');
        }
        else{
            $location.path('/groups');
        }
    };


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
    
    console.log(playoffs,        
        nbrOfCupsToWin,
        round,
        step,
        numberOfGames,
               playoffs[round]['teams'].length);

    if(playoffs[round]['result']){
        $scope.games = playoffs[round]['result'];
        
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
    };

    

    $scope.scoreUp = function(player, score,index){
        if(score[index] < nbrOfCupsToWin){
            score[index] = score[index] +1;
            player.score = player.score ? player.score + 1 : 1;
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


}]);

'use strict';

angular.module('beerPongTournamentApp')
.controller('GroupsCtrl', ["$scope", "$location", "Tournament", function ($scope,$location,Tournament) {

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

        for(var k=0, len3=previousResult.length; k<len3; k++){
            //for each rounds per group
            for(var l=0, len4=previousResult[k]['rounds'].length; l<len4; l++){
                //for each game in a round
                for(var a= 0, len5 = previousResult[k]['rounds'][l].length; a< len5; a++){
                    if(previousResult[k]['rounds'][l][a]['winner'] <0){
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

        for(var b=0, len6=groups.length; b < len6; b++){
            var group = groups[b],
                teamsArray = groups[b]['teams'],
                numberOfTeamPerGroup = teamsArray.length;


            var matchs = [],
                priorities = [];

            for(var c=0, len7=teamsArray.length; c<len7; c++){
                priorities.push(0);
            }

            for(var d=1, len8=teamsArray.length; d<len8; d++){
                for(var e=0; e<=d-1; e++){
                    var team1 = [], team2 = [];

                    for(var f= 0, len9 = teamsArray[d]['players'].length; f< len9; f++){
                        teamsArray[d]['players'][f]['score'] = 0;
                        team1.push(angular.copy(teamsArray[d]['players'][f]));

                        teamsArray[e]['players'][f]['score'] = 0;
                        team2.push(angular.copy(teamsArray[e]['players'][f]));
                    }

                    matchs.push({
                        priority: 0,
                        match: [d,e],
                        title:teamsArray[d]['name']+' vs '+teamsArray[e]['name'],
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
            if(numberOfGames === 0){
                $scope.showNextStep = true;
            }
        }
        match.winner = winner;
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

}]);

'use strict';

angular.module('beerPongTournamentApp')
.controller('TablesCtrl', ["$scope", "$routeParams", "$location", "Tournament", function ($scope,$routeParams,$location,Tournament) {

    var stepPlayoff = Tournament.getPlayoffStepAfterGroup(),
        tables = Tournament.getTables(),
        teams = Tournament.getTeams();

    var tableViewFromGroups = $scope.showButton = $routeParams.showButton;

    $scope.tables = tables;

    //playoff
    if(stepPlayoff >-1){
        var nbrOfGroups = Tournament.getNumberOfGroups(),
            numberOfTeamsQualifiedPerGroups = Math.pow(2,stepPlayoff+1)/nbrOfGroups;

        $scope.numberOfTeamsQualifiedPerGroups = numberOfTeamsQualifiedPerGroups;
        
        //set teams for playoffs if not tables from menu
        if(tableViewFromGroups){
            var teamsQualified = [],
                tmpTeams = angular.copy(teams);


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

            $scope.goNextStep = function(){
                $location.path('/playoffs/0');
            };
        }
    }
    //simple championship = only 1 group
    else{
        $scope.goNextStep = function(){
            $location.path('/winner');
        };
    }

}]);

'use strict';

angular.module('beerPongTournamentApp')
  .controller('WinnerCtrl', ["$scope", "Tournament", function ($scope,Tournament) {
   
      var playoffs = angular.copy(Tournament.getPlayoffs()),
          winner = playoffs.pop()['teams'][0];
            
      $scope.winner = winner;
  }]);

'use strict';

angular.module('beerPongTournamentApp')
.controller('HeaderCtrl', ["$scope", "$location", "Tournament", "localStorageService", function ($scope,$location,Tournament,localStorageService) {

    var currentPath = $location.url();
    
    $scope.goTournament = localStorageService.get('tournamentPath');

    $scope.isOpen = false;
    
    $scope.iconActive = -1;

    if(currentPath === '/tables/0'){
        $scope.iconActive = 1;
    }
    else if(currentPath === '/scorers'){
        $scope.iconActive = 2;
    }
    else{
        localStorageService.set('tournamentPath','#'+currentPath);
        $scope.goTournament = '#'+currentPath;
        $scope.iconActive = 0;
    }

    $scope.displayTablesButton = Tournament.getTables();
    $scope.displayScorersButton = Tournament.getTeams();

    $scope.toggleMenu = function(){
            $scope.isOpen = !$scope.isOpen;
    };

}]);

'use strict';

angular.module('beerPongTournamentApp')
  .controller('ScorersCtrl', ["$scope", "Tournament", function ($scope,Tournament) {
    
      $scope.scorers = Tournament.getScorers();
      
      console.log('scorers',$scope.scorers);
      
  }]);

'use strict';

angular.module('beerPongTournamentApp')
.factory('GroupEngine', function GroupEngine() {

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
                        canBeMakeAnOtherRound = false;
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
        if(numberOfPlayers % 2 === 0 && numberOfPlayers > 4){
            var category2 = {
                numberOfPlayers:2,
                configurations:[]
            };
            category2.configurations = algo(numberOfPlayers/2);
            result.push(category2);
        }

        /* equipe de 3 */
        if(numberOfPlayers % 3 === 0 && numberOfPlayers > 6){
            var category3 = {
                numberOfPlayers:3,
                configurations:[]
            };
            category3.configurations = algo(numberOfPlayers/3);
            result.push(category3);
        }


        return result;
    };


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
        localStorageService.remove('tournamentPath');

        tournamentSettings = teams = groupResult = playoffs = false;
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
                // console.log(b.win-a.win);
                return b.win-a.win;
            });
            tables.push(group);
        }
        return tables;
    };

    function updateScore(scorers,playerId,score){
        var i = scorers.length;
        while( i-- ) {
            if( scorers[i].id === playerId ){
                scorers[i]['score'] += score;
                scorers[i]['numberOfGame'] += 1;
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
                                    updateScore(scorers,playerTeamHome.id,playerTeamHome.score);
                                }
                                if(l<numberOfPlayerTeamAway){
                                    var playerTeamAway = match.scorers[1][l];
                                    updateScore(scorers,playerTeamAway.id,playerTeamAway.score);
                                }
                            }
                        }

                    }
                }
            }
        }
        
        console.log('playoffs',playoffs);
        
        if(playoffs){
             for(var i=0, len = playoffs.length; i<len; i++){
                 var playoffRound= playoffs[i];
                 
                 //last element can be the winner so no attribut result
                 if(playoffRound.result){
                     for(var j=0, len2 = playoffRound.result.length; j<len2; j++){
                        
                     }
                 }
                 
             
             }
        }

        scorers.sort(function(a, b){
            return b.score-a.score;
        });
        return scorers;
    };

}]);

'use strict';

angular.module('beerPongTournamentApp')
  .constant('constants', {
    PLAYOFF_NAME:['final', 'semi-final', 'quarter-final','16nd round', '32nd round', '64nd round']
  });
