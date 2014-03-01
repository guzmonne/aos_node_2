// ===================
// MODULE DEPENDENCIES
// ===================
var express    = require('express');
var fs         = require('fs');
var http       = require('http');
var path       = require('path');
var toobusy    = require('toobusy');
var config     = require('./siteConf.js');
var RedisStore = require('connect-redis')(express);

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

// ======
// ROUTES
// ======
app.get('/', function(req, res){
	res.render('index');
});

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