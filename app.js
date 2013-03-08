
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
  , jsroute = require('./routes/dynamicJson')
  , repl = require("repl"); // Used to make a REPL;

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.basicAuth(function (user, pass) {
    return true;
  }));
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



// Use this to request a pack by raw ID
app.get('/_gatekeeper/packByID.json/:id', jsroute.packByID);

// Use these with Chunk.save() to create/save chunks
app.put('/_gatekeeper/updateByID.json/:id', jsroute.updateByID);

// Get a graphified version for /graph/. This is kinda messy code
app.get('/_gatekeeper/graphByID_shim.json/:id', jsroute.graphByID_shim);

// Search query
app.get('/_seeker/search.json', jsroute.searchFor);

// These two routes go to the view
app.get('/nb/:bookName/:packName', routes.index);
app.get('/graph/:bookName/:packName', routes.graph);

// These are unused
app.get('/', routes.index);
app.get('/users', user.list);

// Test pages can be put here
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
