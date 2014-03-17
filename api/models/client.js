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
	name: String,
	doc : {
		type  : String,
		number: String,
	},
	phones   : [Phones],
	addresses: [Addresses],
	email    : String,
});

mongoose.model('Client', Client);
var Client = mongoose.model('Post');

Client = function(){};

// Find all clients
Client.prototype.findAll = function(callback){
	Client.find({}, function(err, clients){
		callback(null, clients);
	});
};