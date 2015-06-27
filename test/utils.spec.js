var expect = require("chai").expect;
var utils = require("../utils");

describe("utils", function() {

  it("returns the landscape orientation for hackernews", function() {
    var orientation = utils.getOrientation("https://news.ycombinator.com/item?id=7978804");
    expect(orientation).to.equal("landscape");
  });

  it("returns the portrait orientation otherwise", function() {
    var orientation = utils.getOrientation("http://www.wsj.com/articles/airbnb-raises-1-5-billion-in-one-of-largest-private-placements-1435363506");
    expect(orientation).to.equal("portrait");
  });

});
