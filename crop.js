var gm = require('gm');

gm('./bi.jpg').crop(375,667,0,0).write('./bi_1.jpg', function(err) {
  if(err) console.error(err);
});

gm('./bi.jpg').crop(375,667,0,667).write('./bi_2.jpg', function(err) {
  if(err) console.error(err);
});
