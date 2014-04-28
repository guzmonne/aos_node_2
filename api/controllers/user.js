// ======================
// MODELS AND CONTROLLERS
// ======================
var UserModel = require('../models/user').UserModel;
var User      = new UserModel();

exports.index = function(req, res){
	var id     = req.params.id;
	var fields = req.query.fields;
	if (id){
		User.findByClientId(id, fields, function(error, models){
			res.send(models);
		});
	} else {
		User.findAll(fields, function(error, models){
			res.send(models);
		});
	}
};

exports.create = function(req, res){
	User.create(req.body, function(error, model){
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
	User.update(req.params.id, req.body, function(error, model){
		if (error){return res.send(400, {err: error});}
		res.send(200, model);
	});
};

exports.show = function(req, res){
	if (!req.params.id){return res.send(400, {err: {
		msg: 'No ID was passed'
	}});}
	User.show(req.params.id, function(error, model){
		if (error) {return res.send(400, {err: error});}
		res.send(200, model);
	});
};