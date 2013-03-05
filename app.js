
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , normRoutes = require('./routes/norm') // Used for my testing purposes
  , http = require('http')
  , path = require('path')
  , gk = require('./gatekeeper')
  , repl = require("repl"); // Used to make a REPL;

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('your secret here'));
  app.use(express.session());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/:packName', routes.index);

app.get('/_gatekeeper/byID.json', routes.packByID);

app.get('/', routes.index);
app.get('/users', user.list);
app.get('/_norm/:page', normRoutes.pages)



var server = http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

/*
var io = require('socket.io').listen(server);

io.sockets.on('connection', function (socket) {
  socket.on('addNode', function (data) {
    //
  });
  
  socket.on('rawQueryNodes', function(data) {
    db.chunks.find(data, function (err, nodes) {
      socket.emit('rawQueryNodesRes', nodes);
    });
  });
  
  socket.emit('handshake', {hello: 'world'});
});
*/

repl.start({
  prompt: "node via stdin> ",
  input: process.stdin,
  output: process.stdout
});
