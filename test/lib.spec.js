var expect = require("chai").expect;
var lib = require("../lib");

describe("lib", function() {

  it("generate screenshots for a url in portrait mode", function(done) {
    this.timeout(45000);
    var url = "http://on.wsj.com/1SRejRP";
    lib.generateScreenshotsFromURL(url, function(err, medias) {
      expect(err).to.not.exist;
      expect(medias.length).to.equal(4);
      expect(medias[0].match(/cropped-0.jpg$/)).to.not.be.null;
      expect(lib.getImageOrientation(medias[0])).to.equal("portrait");
      console.log("medias: ", medias);
      done();
    });
  });

  it("detects the orientation of an image in landscape", function(done) {
    var orientation = lib.getImageOrientation(__dirname+"/full-screenshot-landscape.png");
    expect(orientation).to.equal("landscape");
    done();
  });

  it("detects the orientation of an image in portrait", function(done) {
    var orientation = lib.getImageOrientation(__dirname+"/full-screenshot-portrait.png");
    expect(orientation).to.equal("portrait");
    done();
  });

  it("automatically swich to landscape mode if it detects an horizontal scrollbar", function(done) {
    this.timeout(45000);
    var url ="https://www.mailpile.is/blog/2015-07-02_Licensing_Decision.html";
    lib.generateScreenshotsFromURL(url, function(err, medias) {
      expect(err).to.not.exist;
      expect(medias.length).to.equal(4);
      expect(lib.getImageOrientation(medias[0])).to.equal("landscape");
      expect(medias[0].match(/cropped-0.jpg$/)).to.not.be.null;
      console.log("medias: ", medias);
      done();
    });

  });

});

