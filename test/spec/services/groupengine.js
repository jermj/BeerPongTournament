'use strict';

describe('Service: groupEngine', function () {

  // load the service's module
  beforeEach(module('beerPongTournamentApp'));

  // instantiate service
  var groupEngine;
  beforeEach(inject(function (_groupEngine_) {
    groupEngine = _groupEngine_;
  }));

  it('should do something', function () {
    expect(!!groupEngine).toBe(true);
  });

});
