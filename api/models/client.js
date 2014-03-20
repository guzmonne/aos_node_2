// ===================
// MODULE DEPENDENCIES
// ===================
var mongoose   = require('mongoose');
var ShortId    = require('mongoose-shortid');
var timestamps = require('mongoose-timestamp');

// =======
// SCHEMAS
// =======
var Schema   = mongoose.Schema;

var Address = new Schema({
	street    : String,
	city      : String,
	department: String,
});

var Phone = new Schema({
	number: String,
});

var Client = new Schema({
	_id: {
		type   : ShortId,
		len    : 6,
		base   : 10,
		retries: 10
	}, 
	name        : String,
	'doc-type'  : String,
	'doc-number': String,
	phones      : [Phone],
	addresses   : [Address],
	email       : {
		type: String,
		lowecase: true,
	},
});

// =======
// PLUGINS
// =======
Client.plugin(timestamps);

// =====
// MODEL
// =====
mongoose.model('Client', Client);
var Client = mongoose.model('Client');

// ==================
// EXPORT CONSTRUCTOR
// ==================
ClientModel = function(){};
// FUNCTIONS
// ---------
// Find all clients
// ----------------
ClientModel.prototype.findAll = function(callback){
	Client.find({}, function(err, clients){
		callback(null, clients);
	});
};
// Create Client
// -------------
ClientModel.prototype.create = function(params, callback){
	var client = new Client({
		'name'      : params['name'],
		'email'     : params['email'],
		'doc-type'  : params['doc-type'],
		'doc-number': params['doc-number'],
	});
	for (var i = 0; i < params['phones'].length; i++){
		client.phones.push(params['phones'][i]);
	}
	for (var i = 0; i < params['addresses'].length; i++){
		client.addresses.push(params['addresses'][i]);
	}
	client.save(function(err, client){
		if (err){return callback(err);}
		callback(null, client);
	});
};
// Update Client
// -------------
ClientModel.prototype.update = function(id, params, callback){
	Client.findOne({"_id": id}, function(err, client){
		if (err){return callback(err);}
		client['name']       = params['name'];
		client['email']      = params['email'];
		client['doc-type']   = params['doc-type'];
		client['doc-number'] = params['doc-number'];
		client.phones = [];
		client.addresses = [];
		for (var i = 0; i < params['phones'].length; i++){
			client.phones.push(params['phones'][i]);
		}
		for (var i = 0; i < params['addresses'].length; i++){
			client.addresses.push(params['addresses'][i]);
		}
		client.save(function(err, client){
			if (err){return callback(err);}
			callback(null, client);
		})
	});
};
// Show Client
// -----------
ClientModel.prototype.show = function(id, callback){
	Client.findOne({"_id": id}, function(err, client){
		if (err){return callback(err);}
		callback(null, client);
	});
};
// =======
// EXPORTS
// =======
exports.ClientModel = ClientModel;