'use strict';

describe('Controller: ManualteamnamingCtrl', function () {

  // load the controller's module
  beforeEach(module('beerPongTournamentApp'));

  var ManualteamnamingCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ManualteamnamingCtrl = $controller('ManualteamnamingCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
