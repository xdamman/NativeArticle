var fs = require('fs')
  , exec = require('child_process').exec
  , execSync = require('child_process').execSync
  , crypto = require('crypto')
  , request = require('request')
  , async = require('async')
  , twitter = require('twitter')
  , settings = require('./settings.json')
  ;

/*
var settings = {
  "twitter": {
    "consumer_key": process.env.TWITTER_CONSUMER_KEY,
    "consumer_secret": process.env.TWITTER_CONSUMER_SECRET,
    "access_token_key": process.env.TWITTER_ACCESS_TOKEN_KEY,
    "access_token_secret": process.env.TWITTER_ACCESS_TOKEN_SECRET
  }
};
*/

var oauthKeys = {
  "consumer_key": settings.twitter.consumer_key, 
  "consumer_secret": settings.twitter.consumer_secret,
  "token": settings.twitter.access_token_key,
  "token_secret": settings.twitter.access_token_secret
};

var twit = new twitter(settings.twitter);
var md5 = function(str) {
  return crypto.createHash('md5').update(str).digest("hex");
};

var sendTweet = function(text, in_reply_to_status_id, media_ids, cb) {

  var data = {
      status: text
     , in_reply_to_status_id: in_reply_to_status_id
    , media_ids: media_ids.join(',')
  };

  console.log("Submitting", data);

  var r = request.post({url:'https://api.twitter.com/1.1/statuses/update.json',oauth:oauthKeys, form: data}, function(err, httpResponse, body) {
    if(httpResponse.statusCode != 200) return console.log("Response: ", body); 
    if(cb) cb(err, body.media_id_string);
  });

};

var uploadMedia = function(filename, cb) {

  var media = fs.createReadStream(filename);

  var r = request.post({url:'https://upload.twitter.com/1.1/media/upload.json',oauth:oauthKeys}, function(err, httpResponse, body) {
    if(err) return console.error(err);
    if(httpResponse.statusCode != 200) return console.log("Response: ", body); 

    var json = JSON.parse(body);
    cb(err, json.media_id_string);
  });

  var form = r.form();
  form.append('media', media);

}

// var medias = ['bi_1.jpg','bi_2.jpg'];

var medias = [];

var sendTweetWithMedias = function(tweet, in_reply_to_status_id, medias, cb) {

  if(medias.length == 0) return;
  
  console.log("Uploading ", medias);

  async.map(medias, uploadMedia, function(err, media_ids) {
    sendTweet(tweet, in_reply_to_status_id, media_ids);
    if(cb) cb(err);
  });

}

var processUrl = function(url, source) {

  console.log("> Processing url ", url);
  var path = __dirname + "/screenshots/"+md5(url);
  var filename = path + "/full.jpg";
  execSync("mkdir -p "+path);
  exec("node_modules/.bin/phantomjs --ignore-ssl-errors=yes capture.js "+url+" "+filename, function(err, stdout, stderr) {
    exec("gm convert -crop 375x667 "+filename+" +adjoin "+path+"/cropped-%01d.jpg", function(err, stdout, stderr) {
      var files = fs.readdirSync(path);
      var medias = files.slice(0,2);
      for(var i in medias) {
        medias[i] = path + "/"+medias[i];
      }
      sendTweetWithMedias("Source: "+url+" via @"+source.username, source.in_reply_to_status_id, medias, function(err) {
        console.log("> Removing "+path);
        exec("rm -rf "+path);
      });
    });
  });
};

function processTweet(tweet) {

  if(!tweet.entities) return;
  if(!tweet.entities.urls || tweet.entities.urls.length == 0) return;

  // We don't process tweets from ourself
  if(tweet.user.screen_name == 'NativeArticle') return;

  // We don't process tweets that mention us
  if(tweet.text && tweet.text.match(/@NativeArticle/i)) return;

  var url = tweet.entities.urls[0].expanded_url;

  processUrl(url, { username: tweet.user.screen_name, in_reply_to_status_id: tweet.id_str }); 

};

twit.stream('user', function(stream) {

  stream.on('data', function(data) {

    // We don't process retweets, just interested in original tweets
    // var tweet = data.retweeted_status || data;
    if(data.retweeted_status) return;

    var tweet = data;

    if(tweet.user) {
      console.log("\n-----------------------------------------------------------------------------\n");
      console.log("Tweet from : "+tweet.user.screen_name, tweet.text);
      processTweet(tweet);
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

