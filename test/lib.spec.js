var expect = require("chai").expect;
var lib = require("../lib");

describe("lib", function() {

  it("generate screenshots for a url", function(done) {
    this.timeout(45000);
    var url = "http://on.wsj.com/1SRejRP";
    lib.generateScreenshotsFromURL(url, function(err, medias) {
      expect(err).to.not.exist;
      console.log("medias: ", medias);
      done();
    });
  });

});

