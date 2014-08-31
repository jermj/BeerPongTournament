'use strict';

describe('Controller: PlayoffsresultCtrl', function () {

  // load the controller's module
  beforeEach(module('beerPongTournamentApp'));

  var PlayoffsresultCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    PlayoffsresultCtrl = $controller('PlayoffsresultCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
