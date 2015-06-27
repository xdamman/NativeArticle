var twitter = require('twitter')
  , settings = require('./settings.json')
  , processor = require('./processor')
  ;

var twit = new twitter(settings.twitter);

twit.stream('user', function(stream) {

  stream.on('data', function(tweet) {

    if(tweet.user) {
      console.log("\n-----------------------------------------------------------------------------\n");
      console.log("Tweet from : "+tweet.user.screen_name, tweet.text);
      processor(tweet);
    }

  });

  stream.on('error', function(e) {
    console.error("Error in twitter stream", e);
    process.exit(1);
  });

  stream.on('end', function(e) {
    console.log("Twitter stream ended -- exiting");
    process.exit(1);
  });

});

