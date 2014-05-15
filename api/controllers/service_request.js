// ======================
// MODELS AND CONTROLLERS
// ======================
var ServiceRequestModel = require('../models/service_request').ServiceRequestModel;
var ServiceRequest      = new ServiceRequestModel();

exports.index = function(req, res){
	var client_id = req.query.client_id;
	if (client_id){
		ServiceRequest.findByClientId(client_id, function(error, service_requests){
			res.send(service_requests);
		});
	} else {
		ServiceRequest.findAll(function(error, service_requests){
			res.send(service_requests);
		});
	}
};

exports.create = function(req, res){
	ServiceRequest.create(req.body, function(error, service_request){
		if (error){
			return res.send(400, {err: error});
		}
		res.send(200, service_request);
	});
};

exports.update = function(req, res){
	if (!req.params.id){return res.send(400, {err: {
		msg: 'No ID was passed'
	}});}
	ServiceRequest.update(req.params.id, req.body, function(error, service_request){
		if (error){return res.send(400, {err: error});}
		res.send(200, service_request);
	});
};

exports.show = function(req, res){
	if (!req.params.id){return res.send(400, {err: {
		msg: 'No ID was passed'
	}});}
	ServiceRequest.show(req.params.id, function(error, service_request){
		if (error) {return res.send(400, {err: error});}
		res.send(200, service_request);
	});
};