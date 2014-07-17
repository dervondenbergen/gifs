var express = require('express')
  , request = require('request')
  , path = require('path')
  , fs = require('fs');

var app = express();

//var pw = 'w0wmuchstr0ngs0secure';

var pw = '123';

// all environments
app.set('port', 1337);
app.set('views', __dirname + '/t');
app.set('view engine', 'jade');
app.use(express.compress());
app.use(express.methodOverride());
app.use(express.bodyParser());
app.use(app.router);
app.use('/', express.static(path.join(__dirname, 'gifs')));

app.get('/', function (req,res) {

  fs.readdir(path.join(__dirname, 'gifs'), function (err,files) {

    if (err) {
      res.send(500,'there was an error on the server :(');
      return;
    }

    if (files.length) {
      var file = Math.floor(Math.random() * files.length);
      res.render('gif', { gif: files[0] });
    } else {
      res.send(404,'there are no gifs :(');
    }

  });

});

app.get('/list', function (req,res) {

  fs.readdir(path.join(__dirname, 'gifs'), function (err,files) {

    if (err) {
      res.send(500,'there was an error on the server :(');
      return;
    }

    if (files.length) {
      res.render('list', { gifs: files });
    } else {
      res.send(404,'there are no gifs :(');
    }

  });

});

app.get('/gallery', function (req,res) {

  fs.readdir(path.join(__dirname, 'gifs'), function (err,files) {

    if (err) {
      res.send(500,'there was an error on the server :(');
      return;
    }

    if (files.length) {
      res.render('gallery', { gifs: files });
    } else {
      res.send(404,'there are no gifs :(');
    }

  });

});

app.get('/upload', function (req, res) {
  
  res.render('upload');
  
});

app.post('/upload', function(req, res) {
  
  var name = req.body.name
    , url = req.body.url
    , password = req.body.password;
  
  if (password == pw) {
    
    if (name && url) {
    
      var r = request(url);
      
      r.on('response', function (resp) {
        
        if (resp.statusCode == 200) {
          
          r.pipe(fs.createWriteStream( path.join(__dirname, 'gifs', name + '.gif') ));
          res.render('upload', { message: 'upload successful', type: 'success' } );
          
        } else {
          
          res.render('upload', { message: 'error while getting image', type: 'error' } );
          
        }
      
      })
      
    } else {
      
      res.render('upload', { message: 'name and url has to be provided', type: 'error' } );
      
    }
    
  } else {
    res.render('upload', { message: 'password not right', type: 'error' } );
  }
  
});

app.listen(app.get('port'));
console.log('Express server listening on port ' + app.get('port'));
