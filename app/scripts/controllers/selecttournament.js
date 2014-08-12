'use strict';

angular.module('beerPongTournamentApp')
.controller('SelectTournamentCtrl', function ($scope,$location,GroupEngine) {

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



});