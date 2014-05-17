// ======================
// MODELS AND CONTROLLERS
// ======================
var UserModel = require('../models/user').UserModel;
var User      = new UserModel();
var _         = require('underscore');

exports.index = function(req, res){
	var techs  = req.query.techs;
	var fields = (_.isString(req.query.fields)) ? req.query.fields : null;
	if (techs){
		User.findTechnicians(function(error, users){
			res.send(users);
		});
	} else {
		User.findAll(fields, function(error, users){
			res.send(users);
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
	User.updateById(req.params.id, req.body, function(error, model){
		if (error){return res.send(400, {err: error});}
		res.send(200, model);
	});
};

exports.show = function(req, res){
	if (!req.params.id){return res.send(400, {err: {
		msg: 'No ID was passed'
	}});}
	User.findById(req.params.id, function(error, model){
		if (error) {return res.send(400, {err: error});}
		res.send(200, model);
	});
};