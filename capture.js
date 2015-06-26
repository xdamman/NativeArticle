var system = require('system');
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
page.viewportSize = { width: 375, height: 667 };
//the clipRect is the portion of the page you are taking a screenshot of
page.clipRect = { top: 0, left: 0, width: 375, height: 1334 };
page.settings.javascriptEnabled = false;
page.settings.resourceTimeout = 5000;
page.settings.userAgent = "Mozilla/5.0 (iPhone; CPU iPhone OS 8_0_2 like Mac OS X) AppleWebKit/600.1.4 (KHTML, like Gecko) Version/8.0 Mobile/12A366 Safari/600.1.4";
//the rest of the code is the same as the previous example
page.open(uri, function(status) {
  page.render(filename);
  phantom.exit();
});
