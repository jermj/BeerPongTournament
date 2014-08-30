'use strict';

angular.module('beerPongTournamentApp')
  .directive('progressBargit', function () {
    return {
      template: '<div></div>',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
        element.text('this is the progressBargit directive');
      }
    };
  });
