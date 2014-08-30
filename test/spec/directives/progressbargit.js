'use strict';

describe('Directive: progressBargit', function () {

  // load the directive's module
  beforeEach(module('beerPongTournamentApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<progress-bargit></progress-bargit>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the progressBargit directive');
  }));
});
