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
	Client.create(req.body, function(error, client){
		if (error){
			return res.send(400, {err: error});
		}
		res.send(200, client);
	});
};

exports.update = function(req, res){
	if (!req.params.id){return res.send(400, {err: {
		msg: 'No ID was passed'
	}});}
	Client.update(req.params.id, req.body, function(error, client){
		if (error){return res.send(400, {err: error});}
		res.send(200, client);
	});
};