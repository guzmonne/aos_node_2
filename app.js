// =========
// NEW RELIC
// =========
require('newrelic');

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
var async         = require('async');

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
  app.use(express.static(path.join(__dirname, 'tests')));
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
//app.use(function(req, res, next){
//	if (toobusy()){
//		res.send(503, "I'm too busy right now, sorry for the inconvenience.");
//	} else {
//		next();
//	}
//});

// ==========
// CONTROLERS
// ==========
var client          = require('./api/controllers/client'); 
var service_request = require('./api/controllers/service_request'); 
var appliance       = require('./api/controllers/appliance'); 
var models          = require('./api/controllers/model');
var users           = require('./api/controllers/user');

// ======
// MODELS
// ======
var ModelModel  = require('./api/models/model').ModelModel;
var Model       = new ModelModel();
var ClientModel = require('./api/models/client').ClientModel;
var Client      = new ClientModel();
var UserModel   = require('./api/models/user').UserModel;
var User        = new UserModel();

// ======
// ROUTES
// ======
// Index
// -----
app.get('/', function(req, res){
	async.parallel({
		models: function(callback){
			Model.findAll("-appliances", function(err, models){
				if (err){return callback(err);}
				callback(null, JSON.stringify(models));
			});
		},
		clients: function(callback){
			Client.findAll("-service_requests", function(err, clients){
				if (err){return callback(err);}
				callback(null, JSON.stringify(clients));
			});
		},
		techs: function(callback){
			User.findTechnicians(function(err, techs){
				if (err){return callback(err);}
				callback(null, JSON.stringify(techs));
			});
		},
	}, function(err, results){
		res.render('index', {
			csrf   : req.csrfToken(),
			clients: results.clients,
			models : results.models,
			techs  : results.techs,
		});
	});
});
// Report
// ------
app.get('/print/A4', function(req, res){
	res.render('A4', {
		csrf: req.csrfToken()
	});
});
// Client
// ------
app.get( '/api/clients'    , client.index);
app.get( '/api/clients/:id', client.show);
app.post('/api/clients'    , client.create);
app.put( '/api/clients/:id', client.update);
// Service Requests
// ----------------
app.get('/api/service_requests'           , service_request.index);
app.get('/api/service_requests/:id'       , service_request.show);
app.post('/api/service_requests'          , service_request.create);
// Appliances
// ----------
app.get('/api/appliances'    , appliance.index);
app.get('/api/appliances/:id', appliance.show);
app.put('/api/appliances/:id', appliance.update);
// Models
// ------
app.get( '/api/models'    , models.index);
app.post('/api/models'    , models.create);
app.get( '/api/models/:id', models.show);
app.put( '/api/models/:id', models.update);
// Users
// -----
app.get( '/api/users'     , users.index);
app.get( '/api/users/:id' , users.show);
app.post('/api/users'     , users.create);
app.put( '/api/users/:id' , users.update);

// =============
// DEFAULT ROUTE
// =============
app.use(function(req, res){
  res.render('errors/400');
});

// ===========================
// SERVER & SERVER-SIDE EVENTS
// ===========================
var server = http.createServer(app);

server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});