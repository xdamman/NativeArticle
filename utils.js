var utils = {

  domain: function(url) {
    return url.replace(/https?:\/\//,'').replace(/\/.*/,'');
  },

  getOrientation: function(url) {
    switch(this.domain(url)) {
      case 'news.ycombinator.com':
      case 'www.reddit.com':
        return 'landscape';
        break;

      default: 
        return 'portrait';
    }
  }
};

module.exports = utils;
