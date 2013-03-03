
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , normRoutes = require('./routes/norm') // Used for my testing purposes
  , http = require('http')
  , path = require('path')
  , gk = require('./gatekeeper');
  
var databaseUrl = "localhost";
var collections = ["chunks"]
var db = require("mongojs").connect(databaseUrl, collections);

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

app.get('/', routes.index);
app.get('/users', user.list);
app.get('/norm/:page', normRoutes.pages)

/*
db.chunks.save({email: "srirangan@gmail.com", password: "iLoveMongo", sex: "male"}, function(err, saved) {
  if( err || !saved ) console.log("User not saved");
  else console.log("User saved");
});

db.chunks.find({sex: "male"}, function(err, users) {
  if( err || !users) console.log("No male users found");
  else users.forEach( function(femaleUser) {
    console.log(femaleUser);
  } );
});
*/

var server = http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

var io = require('socket.io').listen(server);

io.sockets.on('connection', function (socket) {
  socket.emit('test', {hello: 'world'});
});
