var fs = require('fs')
  , exec = require('child_process').exec
  , execSync = require('child_process').execSync
  , crypto = require('crypto')
  , utils = require('./utils')
  ;

var lib = {

  md5: function(str) {
    return crypto.createHash('md5').update(str).digest("hex");
  },

  getImageOrientation: function(filename) {

    var format = execSync("gm identify "+filename+" | awk '{print $3}'", { encoding:'utf8' });
    var tokens = format.match(/([0-9]+)x([0-9]+)/);
    var width = parseInt(tokens[1], 10);
    var height = parseInt(tokens[2], 10);

    return (width == 375) ? "portrait" : "landscape";

  },

  generateScreenshotsFromURL: function(url, cb) {

    var path = "/tmp/NativeArticle/"+lib.md5(url);
    var filename = path + "/full.png";

    var captureCommand = "node_modules/.bin/phantomjs --ignore-ssl-errors=yes capture.js "+url+" "+filename;

    // We create a temporary directory for this website (ttl 5mn)
    execSync("mkdir -p "+path);
    setTimeout(function() {
      console.log("lib> Removing "+path);
      exec("rm -rf "+path);
    }, 5*60*1000); 

    // console.log("lib> running capture command: "+captureCommand);
    exec(captureCommand, function(err, stdout, stderr) {

      var orientation = lib.getImageOrientation(filename);
      var format = (orientation == "portrait") ? "375x667" : "667x375";
      var cropCommand = "gm convert -background white -extent 0x0 -crop "+format+" "+filename+" +adjoin "+path+"/cropped-%01d.jpg";

      // console.log("lib> screenshot saved in "+filename);
      // console.log("lib> running crop command: "+cropCommand);
      console.log("lib> cropping in "+format+" tiles");
      exec(cropCommand, function(err, stdout, stderr) {
        var files = fs.readdirSync(path);
        var medias = [];
        for(var i=0;i<Math.min(4,files.length-1);i++) {
          medias.push(path + "/"+files[i]);
        }
        if(cb) cb(err, medias);
      });
    });
  }

};

module.exports = lib;

