// ======================
// MODELS AND CONTROLLERS
// ======================
var ApplianceModel = require('../models/appliance').ApplianceModel;
var Appliance      = new ApplianceModel();

exports.index = function(req, res){
	Appliance.findAll(function(error, appliances){
		if(error){return res.send(error);}
		res.send(appliances);
	});
};

exports.update = function(req, res){
	var id = req.params.id;
	Appliance.updateById(id, req.body, function(error, appliance){
		if(error){return res.send(error);}
		res.send(appliance);
	});
};

exports.show = function(req, res){
	var id = req.params.id;
	Appliance.show(id, function(error, appliance){
		if(error){return res.send(error);}
		res.send(appliance);
	});
};