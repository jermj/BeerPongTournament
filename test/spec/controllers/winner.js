'use strict';

describe('Controller: WinnerCtrl', function () {

  // load the controller's module
  beforeEach(module('beerPongTournamentApp'));

  var WinnerCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    WinnerCtrl = $controller('WinnerCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
