'use strict';

angular.module('beerPongTournamentApp')
.controller('SelectTournamentCtrl', function ($scope,$location,GroupEngine,Tournament,constants) {


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



});