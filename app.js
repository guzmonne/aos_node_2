// ===================
// MODULE DEPENDENCIES
// ===================
var express       = require('express');
var fs            = require('fs');
var http          = require('http');
var path          = require('path');
var toobusy       = require('toobusy');
var config        = require('./siteConf.js');
var RedisStore    = require('connect-redis')(express);
var mongoose      = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');

// ==================
// MONGODB & MONGOOSE
// ==================
mongoose.connect('mongodb://localhost/aos2');
var db = mongoose.connection;
// Error
// -----
db.on('error', console.error.bind(console, 'connection error'));
// Open
// ----
db.once('open', function callback(){
	console.log('Connection to mongoDB successful');
});
// Pure Auto Increment
autoIncrement.initialize(db);

// =======
// EXPRESS
// =======
// Initiate express app
var app = express();
app.set('port', config.port || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser());
app.use(express.session({
	store: new RedisStore({
		host: config.redis.host,
		port: config.redis.port,
		db  : config.redis.db,
		pass: config.redis.pass
	}),
	secret: config.sessionSecret 
}));
app.use(express.csrf());

// ==========
// CSFR TOKEN
// ==========
app.use(function(req, res, next){
	res.setHeader('X-CSRF-Token', req.csrfToken());
	next();
});

// ============
// STATIC FILES
// ============
app.use(express.static(path.join(__dirname, 'public')));

// ================
// DEVELOPMENT ONLY
// ================
if ('development' == app.get('env')) {
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
}

// ===============
// PRODUCTION ONLY
// ===============
if ('production' == app.get('env')) {
	app.use(express.errorHandler());
}

// =======
// TOOBUSY
// =======
app.use(function(req, res, next){
	if (toobusy()){
		res.send(503, "I'm too busy right now, sorry for the inconvenience.");
	} else {
		next();
	}
});

// ==========
// CONTROLERS
// ==========
var client          = require('./api/controllers/client'); 
var service_request = require('./api/controllers/service_request'); 
var appliance       = require('./api/controllers/appliance'); 
var model           = require('./api/controllers/model');
var user            = require('./api/controllers/user');

// ======
// ROUTES
// ======
// Index
// -----
app.get('/', function(req, res){
	res.render('index', { 
  	csrf : req.csrfToken()
  });
});
// Client
// ------
app.get( '/api/client'    , client.index);
app.get( '/api/client/:id', client.show);
app.post('/api/client'    , client.create);
app.put( '/api/client/:id', client.update);
// Service Requests
// ----------------
app.get( '/api/service_request/client/:id', service_request.index);
app.get( '/api/service_request'           , service_request.index);
app.get( '/api/service_request/:id'       , service_request.show);
app.post('/api/service_request'           , service_request.create);
// Appliances
// ----------
app.get('/api/appliance'    , appliance.index);
app.get('/api/appliance/:id', appliance.show);
app.put('/api/appliance/:id', appliance.update);
// Models
// ------
app.get( '/api/model'    , model.index);
app.post('/api/model'    , model.create);
app.get( '/api/model/:id', model.show);
app.put( '/api/model/:id', model.update);
// Users
// -----
app.get( '/api/user' , user.index);
app.post('/api/user' , user.create);

// =============
// DEFAULT ROUTE
// =============
app.use(function(req, res){
  res.render('400');
});

// ===========================
// SERVER & SERVER-SIDE EVENTS
// ===========================
var server = http.createServer(app);

server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});