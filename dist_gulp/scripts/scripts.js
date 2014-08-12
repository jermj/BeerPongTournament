'use strict';

angular
.module('beerPongTournamentApp', [
    'ngRoute'
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
.controller('SelectTournamentCtrl', ["$scope", "$location", "GroupEngine", function ($scope,$location,GroupEngine) {

    var PLAYOFF_NAME = ['final', 'semi-final', 'quarter-final','16nd round', '32nd round', '64nd round']; //TODO when stop???

    $scope.callAlgo = function(numberOfPlayers){
        
        //TODO buffer 300ms

        $scope.showPlayoffs = false;
        
        var configs = GroupEngine.getGroupFromNumberOfPlayers(numberOfPlayers);

        console.log(configs);

        $scope.groupsSelect = [];

        for(var x=0, len=configs.length; x < len; x++){
            for(var y=0, len2=configs[x]['configurations'].length; y < len2; y++){
                //direct tournament
                if(configs[x]['configurations'][y]['directTournament']){
                    $scope.groupsSelect.push({separator:'team of '+configs[x]['numberOfPlayers'],value:'Direct tournament from '+PLAYOFF_NAME[configs[x]['configurations'][y]['step']], directTournament:1});
                }
                //group(s) whith potential playoffs
                else{

                    var playoffs=[];
                    if(configs[x]['configurations'][y]['nbrOfGroups'] === 1){
                        playoffs.push('simple championship');
                    }
                    for(var i=0, len3=configs[x]['configurations'][y]['playOffStepMin'].length; i < len3; i++){
                        playoffs.push(PLAYOFF_NAME[configs[x]['configurations'][y]['playOffStepMin'][i]]);
                    }

                        $scope.groupsSelect.push({separator:'team of '+configs[x]['numberOfPlayers'],value:configs[x]['configurations'][y]['nbrOfGroups']+' group(s) of '+configs[x]['configurations'][y]['nbrOfTeam']+' teams',playOffStepMin:configs[x]['configurations'][y]['playOffStepMin'], playoffs:playoffs});
                }

            }
        }
    }
    
    
    $scope.goNextStep = function(){
        $location.path('/teamNaming');
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
  .controller('TeamNamingCtrl', ["$scope", function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  }]);
