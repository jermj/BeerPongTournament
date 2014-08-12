'use strict';

describe('Controller: TeamnamingCtrl', function () {

  // load the controller's module
  beforeEach(module('beerPongTournamentApp'));

  var TeamnamingCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    TeamnamingCtrl = $controller('TeamnamingCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
