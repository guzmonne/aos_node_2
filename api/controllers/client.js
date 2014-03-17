// ======================
// MODELS AND CONTROLLERS
// ======================
var Client = require('../models/client').Client;
var Client = new Client();

exports.index = function(req, res){
	Client.findAll(function(error, clients){
		res.send(clients);
	});
};