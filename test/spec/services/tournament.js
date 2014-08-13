'use strict';

describe('Service: Tournament', function () {

  // load the service's module
  beforeEach(module('beerPongTournamentApp'));

  // instantiate service
  var Tournament;
  beforeEach(inject(function (_Tournament_) {
    Tournament = _Tournament_;
  }));

  it('should do something', function () {
    expect(!!Tournament).toBe(true);
  });

});
