// ======================
// MODELS AND CONTROLLERS
// ======================
var ApplianceModel = require('../models/appliance').ApplianceModel;
var Appliance      = new ApplianceModel();

exports.index = function(req, res){
	Appliance.findAll(function(error, appliances){
		res.send(appliances);
	});
};

exports.update = function(req, res){
	var id = req.params.id;
	Appliance.updateById(id, req.body, function(error, appliance){
		res.send(appliance);
	});
}