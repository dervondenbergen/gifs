var express = require('express')
  , http = require('http')
  , path = require('path')
  , fs = require('fs');

function Shuffle(o) {
  for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
};

var app = express();

// all environments
app.set('port', 1337);
app.set('views', __dirname + '/t');
app.set('view engine', 'jade');
app.use(express.methodOverride());
app.use(app.router);
app.use('/', express.static(path.join(__dirname, 'gifs')));

app.get('/', function (req,res) {

  fs.readdir(path.join(__dirname, 'gifs'), function (err,files) {

    if (err) {
      res.send(500,'there was an error on the server :(');
      return;
    }

    if (files.length) {
      Shuffle(files);
      res.render('gif', { gif: files[0] });
    } else {
      res.send(404,'there are no gifs :(');
    }

  });

});


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});