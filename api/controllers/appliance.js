// ======================
// MODELS AND CONTROLLERS
// ======================
var ApplianceModel = require('../models/appliance').ApplianceModel;
var Appliance      = new ApplianceModel();

exports.index = function(req, res){
	var model_id           = req.query.model_id;
	var service_request_id = req.query.service_request_id;
	if (model_id){
		return Appliance.findByModelId(model_id, function(error, appliances){
			if(error){return res.send(error);}
			res.send(appliances);
		});
	}
	if (service_request_id){
		return Appliance.findByServiceRequestId(service_request_id, function(error, appliances){
			if(error){return res.send(error);}
			res.send(appliances);
		});
	}
	Appliance.findAll(function(error, appliances){
		if(error){return res.send(error);}
		res.send(appliances);
	});
};

exports.update = function(req, res){
	var id = req.params.id;
	Appliance.updateById(id, req.body, function(error, appliance){
		if(error){return res.send(error);}
		res.send(200, {});
	});
};

exports.show = function(req, res){
	var id = req.params.id;
	Appliance.show(id, function(error, appliance){
		if(error){return res.send(error);}
		res.send(appliance);
	});
};