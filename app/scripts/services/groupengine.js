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
            var nbrPlayersPerGroup = numberOfPlayers/Math.pow(2,compt);

            /* On peut faire x groupe de y joueurs*/
            if(nbrPlayersPerGroup === parseInt(nbrPlayersPerGroup) && nbrPlayersPerGroup > 2){

                var nbrGroups = Math.pow(2,compt);

                var configWithoutPlayogg = nbrGroups+" poules de "+nbrPlayersPerGroup+" equipes ---- optionnel Playoff apres championnat : ";

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
                        nbrPlayersPerGroup: nbrPlayersPerGroup,
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
