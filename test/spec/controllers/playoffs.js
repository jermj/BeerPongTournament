'use strict';

describe('Controller: PlayoffsCtrl', function () {

  // load the controller's module
  beforeEach(module('beerPongTournamentApp'));

  var PlayoffsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    PlayoffsCtrl = $controller('PlayoffsCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
