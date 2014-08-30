'use strict';

angular.module('beerPongTournamentApp')
.directive('progressbar', function () {
    return {
        restrict: "E",
        template: '<div class="progressbar">'+
        '<div>{{current}}/{{total}}</div>'+
        '</div>',
        replace: true,
        scope: {
            total: "=",
            current: "="
        },
        link: function postLink(scope, element) {
            console.log(scope.total,scope.current);
            
            var bar = angular.element(element.children());
            scope.$watch("current", function (value) {
                bar.css("width", value / scope.total * 100 + "%");
            });
        }
    };
});
