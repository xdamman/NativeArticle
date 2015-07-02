var system = require('system');
var utils = require('./utils');
var url, filename;

if (system.args.length != 3) {
  console.log("Usage: phantomjs capture.js URL filename.png\n");
  phantom.exit();
} else {
  url = system.args[1];
  filename = system.args[2];
}

var page = require('webpage').create();
//viewportSize being the actual size of the headless browser

var numberOfScreens = 4;

if(utils.getOrientation(url) == "portrait") {
  page.viewportSize = { width: 375, height: 667 };
  page.clipRect = { top: 0, left: 0, width: 375, height: 667 * numberOfScreens };
}
else {
  page.viewportSize = { width: 667, height: 375 };
  page.clipRect = { top: 0, left: 0, width: 667, height: 375 * numberOfScreens };
}

page.customHeaders = {
  referer: 'https://google.com/' // For wsj.com
};

page.settings.javascriptEnabled = true;
page.settings.resourceTimeout = 30000;
page.settings.userAgent = "Mozilla/5.0 (iPhone; CPU iPhone OS 8_0_2 like Mac OS X) AppleWebKit/600.1.4 (KHTML, like Gecko) Version/8.0 Mobile/12A366 Safari/600.1.4";

page.open(url, function(status) {

  page.render(filename);
  phantom.exit();

});
