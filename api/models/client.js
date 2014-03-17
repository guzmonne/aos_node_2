var mongoose = require('mongoose');

var Schema   = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var Addresses = new Schema({
	street    : String,
	city      : String,
	department: String,
});

var Phones = new Schema({
	number: String,
});

var Client = new Schema({
	name        : String,
	'doc-type'  : String,
	'doc-number': String,
	phones      : [Phones],
	addresses   : [Addresses],
	email       : String,
});

mongoose.model('Client', Client);
var Client = mongoose.model('Client');

ClientModel = function(){};

// Find all clients
ClientModel.prototype.findAll = function(callback){
	Client.find({}, function(err, clients){
		callback(null, clients);
	});
};

// Create Client
ClientModel.prototype.create = function(params, callback){
	console.log(params);
	var client = new Client({
		name        : params['name'],
		email       : params['email'],
		'doc-type'  : params['doc-type'],
		'doc-number': params['doc-number'],
		email       : params['email'],
	});
	for (var i = 0; i < params['phones'].length; i++){
		client.phones.push(params['phones'][i]);
	}
	for (var i = 0; i < params['addresses'].length; i++){
		client.addresses.push(params['addresses'][i]);
	}
	client.save(function(err){
		callback();
	});
};

// =======
// EXPORTS
// =======
exports.ClientModel = ClientModel;