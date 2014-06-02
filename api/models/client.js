// ===================
// MODULE DEPENDENCIES
// ===================
var mongoose      = require('mongoose');
var ShortId       = require('mongoose-shortid');
var timestamps    = require('mongoose-timestamp');
var autoIncrement = require('mongoose-auto-increment');
var _             = require('underscore');

// =======
// SCHEMAS
// =======
var Schema   = mongoose.Schema;

var Client = new Schema({
	'name'      : String,
	'doc-type'  : String,
	'doc-number': String,
	'phones'    : [{
		'number': String 
	}],
	'addresses' : [{
		'street'    : String,
		'city'      : String,
		'department': String,
	}],
	'email'     : {
		'type'    : String,
		'lowecase': true,
	},
	'service_requests' : [{
		type: Schema.Types.ObjectId,
		ref: 'ServiceRequest',
	}],
});

// =======
// PLUGINS
// =======
// Timestamps
// ----------
Client.plugin(timestamps);
// Auto ID
// -------
Client.plugin(autoIncrement.plugin, {
    model: 'Client',
    field: 'id',
    startAt: 1,
});

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
ClientModel.prototype.findAll = function(fields, callback){
	var query = Client.find({});
	if (fields){
		query.select(fields);
	}
	query.exec(function(err, clients){
		if (err){return callback(err);}
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
	if(_.isArray(params['phones'])){
		for (var i = 0; i < params['phones'].length; i++){
			client.phones.push(params['phones'][i]);
		}
	}
	if(_.isArray(params['addresses'])){
		for (var i = 0; i < params['addresses'].length; i++){
			client.addresses.push(params['addresses'][i]);
		}
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
			callback(null, {});
		})
	});
};
// Show Client
// -----------
ClientModel.prototype.show = function(id, fields, callback){
	var query = Client.findOne({'_id': id});
	if (arguments.length > 2){
		if (_.isString(fields)){
			query.select(fields);
		}
	} else {
		callback = fields;
	}
	query.exec(function(err, client){
		if (err){return callback(err);}
		callback(null, client);
	});
};
// =======
// EXPORTS
// =======
exports.ClientModel = ClientModel;