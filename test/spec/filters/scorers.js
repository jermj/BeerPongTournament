'use strict';

describe('Filter: scorers', function () {

  // load the filter's module
  beforeEach(module('beerPongTournamentApp'));

  // initialize a new instance of the filter before each test
  var scorers;
  beforeEach(inject(function ($filter) {
    scorers = $filter('scorers');
  }));

  it('should return the input prefixed with "scorers filter:"', function () {
    var text = 'angularjs';
    expect(scorers(text)).toBe('scorers filter: ' + text);
  });

});
