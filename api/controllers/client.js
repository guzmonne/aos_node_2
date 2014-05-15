// ======================
// MODELS AND CONTROLLERS
// ======================
var ClientModel = require('../models/client').ClientModel;
var Client      = new ClientModel();
var _           = require('underscore');

exports.index = function(req, res){
	var fields = (_.isString(req.query.fields)) ? req.query.fields : null;
	Client.findAll(fields, function(error, clients){
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

exports.show = function(req, res){
	var fields;
	if (!req.params.id){return res.send(400, {err: {
		msg: 'No ID was passed'
	}});}
	if (req.query.fields){
		fields = req.query.fields;
	}
	Client.show(req.params.id, fields, function(error, client){
		if (error) {return res.send(400, {err: error});}
		res.send(200, client);
	});
};