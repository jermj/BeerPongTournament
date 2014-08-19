'use strict';

describe('Controller: ScorersCtrl', function () {

  // load the controller's module
  beforeEach(module('beerPongTournamentApp'));

  var ScorersCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ScorersCtrl = $controller('ScorersCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
