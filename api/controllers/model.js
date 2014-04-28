// ======================
// MODELS AND CONTROLLERS
// ======================
var ModelModel = require('../models/model').ModelModel;
var Model      = new ModelModel();

exports.index = function(req, res){
	var id     = req.params.id;
	var fields = req.query.fields;
	if (id){
		Model.findByClientId(id, fields, function(error, models){
			res.send(models);
		});
	} else {
		Model.findAll(fields, function(error, models){
			res.send(models);
		});
	}
};

exports.create = function(req, res){
	Model.create(req.body, function(error, model){
		if (error){
			return res.send(400, {err: error});
		}
		res.send(200, model);
	});
};

exports.update = function(req, res){
	if (!req.params.id){return res.send(400, {err: {
		msg: 'No ID was passed'
	}});}
	Model.update(req.params.id, req.body, function(error, model){
		if (error){return res.send(400, {err: error});}
		res.send(200, model);
	});
};

exports.show = function(req, res){
	if (!req.params.id){return res.send(400, {err: {
		msg: 'No ID was passed'
	}});}
	Model.show(req.params.id, function(error, model){
		if (error) {return res.send(400, {err: error});}
		res.send(200, model);
	});
};