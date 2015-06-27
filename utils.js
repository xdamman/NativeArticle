var utils = {

  domain: function(url) {
    return url.replace(/https?:\/\//,'').replace(/\/.*/,'');
  },

  getOrientation: function(url) {
    if(this.domain(url) == 'news.ycombinator.com') return 'landscape';
    return 'portrait';
  }

};

module.exports = utils;
