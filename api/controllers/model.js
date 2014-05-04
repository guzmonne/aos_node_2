// ======================
// MODELS AND CONTROLLERS
// ======================
var ModelModel = require('../models/model').ModelModel;
var Model      = new ModelModel();

exports.index = function(req, res){
	var fields = req.query.fields;
	Model.findAll(fields, function(error, models){
		if (error){return res.send(400, error);}
		res.send(models);
	});
};

exports.create = function(req, res){
	Model.create(req.body, function(error, model){
		if (error){return res.send(400, error);}
		res.send(200, model);
	});
};

exports.update = function(req, res){
	if (!req.params.id){return res.send(400, {err: {
		msg: 'No ID was passed'
	}});}
	Model.updateById(req.params.id, req.body, function(error, model){
		if (error){return res.send(400, error);}
		res.send(200, {});
	});
};

exports.show = function(req, res){
	if (!req.params.id){return res.send(400, {err: {
		msg: 'No ID was passed'
	}});}
	Model.findById(req.params.id, function(error, model){
		if (error){return res.send(400, error);}
		res.send(200, model);
	}, {populate: true});
};