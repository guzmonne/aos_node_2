// ======================
// MODELS AND CONTROLLERS
// ======================
var Client = require('../models/client').ClientModel;
var Client = new Client();

exports.index = function(req, res){
	Client.findAll(function(error, clients){
		res.send(clients);
	});
};

exports.create = function(req, res){
	Client.create(req.body, function(error){
		if (error){
			return res.send(400, {err: error});
		}
		res.send(200, {msg: 'Client creation successful'});
	});
};