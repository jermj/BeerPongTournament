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
    .when('/tournament', {
        templateUrl: 'views/tournament.html',
        controller: 'TournamentCtrl'
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
.controller('SelectTournamentCtrl', ["$scope", "$location", "GroupEngine", "Tournament", function ($scope,$location,GroupEngine,Tournament) {

    var PLAYOFF_NAME = ['final', 'semi-final', 'quarter-final','16nd round', '32nd round', '64nd round']; //TODO when stop???

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
                        value:'Direct tournament from '+PLAYOFF_NAME[configs[x]['configurations'][y]['step']],
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
                            value: PLAYOFF_NAME[configs[x]['configurations'][y]['playOffStepMin'][i]]
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


    $scope.goNextStep = function(configuration,playoff){
        
        console.log('goNextStep',configuration,playoff);

        var params = {
            numberOfPlayers: nbrOfPlayers,
            numberOfGroups: configuration.nbrOfGroups,
            numberOfTeamsPerGroup: configuration.numberOfTeams,
            numberOfPlayerPerTeam: configuration.playersPerTeam,
            playoffStepAfterGroup: playoff ? playoff.step : undefined,
            isDirectTournament: configuration.directTournament
        }

        Tournament.init(params);
        $location.path('/teamNaming');
    }



}]);
'use strict';

angular.module('beerPongTournamentApp')
.controller('TournamentCtrl', ["$scope", "Tournament", function ($scope,Tournament) {

    var groups = Tournament.getTeams();

    console.log('groups',groups);

    //if direct tournament
    //random by 2 team

    //else
    //for each group 
    // generate as game as team by group

    /*

      {
        rounds:[
            {
                level:1,
                games: [
                {
                    group: 'GROUP A',
                    equipe1:'equipe sam',
                    equipe2:'equipe dam',
                },
                {
                    group: 'GROUP B',
                    equipe1:'equipe ruch',
                    equipe2:'equipe emil',
                }
                ,]
            }
            {
                level:2,
                games: [
                {
                    group: 'GROUP A',
                    equipe1:'equipe sam',
                    equipe2:'equipe thomas',
                },
                {
                    group: 'GROUP B',
                    equipe1:'equipe ruch',
                    equipe2:'equipe lucas',
                }
                ]
            }
        ]
      }
      */

    function updatePriorities(array, game, games){
        for(var i=0, len=array.length; i<len; i++){
            array[i] = (i === game[0] || i === game[1]) ? 0 : array[i]+1;
        }
        for(var j=0, len2=games.length; j<len2; j++){
            games[j]['priority'] = array[games[j]['match'][0]] + array[games[j]['match'][1]];
        }
        games.sort(function(a,b){return b.priority - a.priority;});
    }


    if(Tournament.isADirectTournament()){
        //TODO
    }
    else{
        console.log('not a direct tournament');

        var planning = [];

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
                    matchs.push({priority: 0, match: [y,j], title:teamsArray[y]['name']+' vs '+teamsArray[j]['name']});
                }
            }

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

            console.log('group round planned',group.rounds);

            //TODO : split gameScheduled by round and make a big JSON

            planning.push(group);
        }

        
        $scope.groups = planning;
        console.log('final planning',planning);

    }


    /*
3 équipes  3 matchs
1 2

2 3

1 3

4 equipes 6 matchs
1 2
3 4

1 3
2 4

1 4
2 3

5 equipes, 3 * 2 + 4   

5/2 = 2.5 = 2

1 2
1 3

1 4
1 5

2 3
2 4

2 5
3 4

3 5
4 5

7 équipes 5 * 3 + 6 = 21 match

7/2 = 3,5 = 3

7 * 3 par rounds



*/


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
        $location.path('/tournament');
    }


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

}]);
