'use strict';

angular.module('beerPongTournamentApp')
.controller('TournamentCtrl', function ($scope,Tournament) {

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


});