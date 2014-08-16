'use strict';

describe('Controller: TablesCtrl', function () {

  // load the controller's module
  beforeEach(module('beerPongTournamentApp'));

  var TablesCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    TablesCtrl = $controller('TablesCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
