'use strict';

angular.module('beerPongTournamentApp')
.controller('HeaderCtrl', function ($scope,$location,Tournament,localStorageService) {

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
    else if(currentPath === '/playoffsResults'){
        $scope.iconActive = 3;
    }
    else{
        localStorageService.set('tournamentPath','#'+currentPath);
        $scope.goTournament = '#'+currentPath;
        $scope.iconActive = 0;
    }

    $scope.displayTablesButton = Tournament.getTables();
    $scope.displayScorersButton = Tournament.getTeams();
    $scope.displayPlayoffsResultButton = Tournament.getPlayoffsResult();

    $scope.toggleMenu = function(){
            $scope.isOpen = !$scope.isOpen;
    };

});
