var fs = require('fs')
  , request = require('request')
  , async = require('async')
  , lib = require('./lib')
  , settings = require('./settings.json')
  ;

var oauthKeys = {
  "consumer_key": settings.twitter.consumer_key, 
  "consumer_secret": settings.twitter.consumer_secret,
  "token": settings.twitter.access_token_key,
  "token_secret": settings.twitter.access_token_secret
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

var sendTweetWithMedias = function(tweet, in_reply_to_status_id, medias, cb) {

  if(medias.length == 0) return;
  
  console.log("Uploading ", medias);

  async.map(medias, uploadMedia, function(err, media_ids) {
    sendTweet(tweet, in_reply_to_status_id, media_ids);
    if(cb) cb(err);
  });

}

function processTweet(tweet) {

  // We don't process retweets, just interested in original tweets
  // var tweet = data.retweeted_status || data;
  if(tweet.retweeted_status) return;

  if(!tweet.entities) return;
  if(!tweet.entities.urls || tweet.entities.urls.length == 0) return;

  // We don't process tweets from ourself
  if(tweet.user.screen_name == 'NativeArticle') return;

  // We don't process tweets that mention us
  if(tweet.text && tweet.text.match(/@NativeArticle/i)) return;

  var url = tweet.entities.urls[0].expanded_url;
  var text = "@"+tweet.user.screen_name+" here is a mobile optimized preview of "+url;

  console.log("> Processing url ", url);

  lib.generateScreenshotsFromURL(url, function(err, medias) { 
    sendTweetWithMedias(text, tweet.id_str, medias); 
  });
};

module.exports = processTweet;
