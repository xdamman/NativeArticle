var system = require('system');
var utils = require('./utils');
var uri, filename;

if (system.args.length != 3) {
  console.log("Usage: phantomjs capture.js URL filename.png\n");
  phantom.exit();
} else {
  uri = system.args[1];
  filename = system.args[2];
}

var page = require('webpage').create();
//viewportSize being the actual size of the headless browser

if(utils.getOrientation(url) == "portrait") {
  page.viewportSize = { width: 375, height: 667 };
  page.clipRect = { top: 0, left: 0, width: 375, height: 1334 };
}
else {
  page.viewportSize = { width: 667, height: 375 };
  page.clipRect = { top: 0, left: 0, width: 667, height: 750 };
}

page.settings.javascriptEnabled = false;
page.settings.resourceTimeout = 45000;
page.settings.userAgent = "Mozilla/5.0 (iPhone; CPU iPhone OS 8_0_2 like Mac OS X) AppleWebKit/600.1.4 (KHTML, like Gecko) Version/8.0 Mobile/12A366 Safari/600.1.4";

page.open(uri, function(status) {
  page.render(filename);
  phantom.exit();
});
