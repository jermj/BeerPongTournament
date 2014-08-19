'use strict';

angular.module('beerPongTournamentApp')
.controller('HeaderCtrl', function ($scope,$location,Tournament,localStorageService) {

    var currentPath = $location.url(),
        goTournament = localStorageService.get('tournamentPath');

    $scope.isOpen = false;

    if(currentPath === '/tables/0'){
        $scope.tablesView = true;
        $scope.scorersView = false;
        $scope.tournamentView = false;
    }
    else if(currentPath === '/scorers'){
        $scope.scorersView = true;
        $scope.tablesView = false;
        $scope.tournamentView = false;
    }
    else{
        localStorageService.set('tournamentPath',currentPath);
        goTournament = currentPath;
        $scope.tournamentView = true;
        $scope.tablesView = false;
        $scope.scorersView = false;
    }

    $scope.displayTablesButton = Tournament.getTables();

    $scope.goBackToTournament =function(){
        console.log('go back tournament',goTournament);
        $location.path(goTournament);
    };

    $scope.goTables =function(){
        console.log('go tables',goTournament);
        $location.path('/tables/0');
    };

    $scope.toggleMenu = function(){
            $scope.isOpen = !$scope.isOpen;
    };

});
