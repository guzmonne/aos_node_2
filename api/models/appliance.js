// ===================
// MODULE DEPENDENCIES
// ===================
var mongoose      = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');
var timestamps    = require('mongoose-timestamp');
var _             = require('underscore');
var ModelModel    = require('../models/model').ModelModel;
var Model         = new ModelModel();
var async         = require('async');

// =======
// SCHEMAS
// =======
var Schema = mongoose.Schema;

var Appliance = new Schema({
	'model_id': {
		type: Schema.Types.ObjectId,
		ref : 'Model'
	},
	'serial'          : String,
	'accessories'     : [String],
	'client_name'     : String,
	'client_id'       : String,
	'repairement_type': String,
	'defect'          : String,
	'observations'    : String,
	'status'          : String,
	'cost': {
		type: Number,
		min : [0, 'El costo no puede ser menor que 0'],
	},
	'solution'       : String,
	'diagnose'       : String,
	'replacements'   : [String],
	'inStock'        : Boolean,
	'departuredAt'   : Date,
	'repairedAt'     : Date,
	'technician_name': String,
	'technician_id'  : String,
	'createdBy'      : String,
	'updatedBy'      : String,
	'service_request_id': {
		type: Schema.Types.ObjectId,
		ref : 'ServiceRequest'
	},
	'createdAt': Date,
	'updatedAt': Date,
});

// =======
// PLUGINS
// =======
// AutoIncrement ID
// ----------------
Appliance.plugin(autoIncrement.plugin, {
model: 'Appliance',
field: 'id',
startAt: 1,
});

// =====
// MODEL
// =====
mongoose.model('Appliance', Appliance);
var Appliance = mongoose.model('Appliance');

// ==================
// EXPORT CONSTRUCTOR
// ==================
ApplianceModel = function(){};
// FUNCTIONS
// ---------
// Fill object
function pickParams(params){
	var date = new Date();
	var result = _.pick(params, 
		 'client_name' 
		,'client_id' 
		,'repairement_type'
		,'defect'
		,'observations'
		,'status'
		,'cost'
		,'solution'
		,'diagnose'
		,'replacements'
		,'inStock' 
		,'departuredAt'
		,'repairedAt'
		,'technician_name' 
		,'technician_id' 
		,'createdBy' 
		,'updatedBy' 
		,'accessories'
		,'serial'
		,'service_request_id'
		,'model_id'
	);
	result.updatedAt = date;
	if (!params['_id']){
		result.createdAt = date;
	}
	if(result.model_id && _.isObject(result.model_id)){
		if (result.model_id['_id']){
			result.model_id = result.model_id['_id'];
		} else {
			delete result.model_id;
		}
	}
	return result;
}
// Create new appliance
// --------------------
ApplianceModel.prototype.create = function(params, callback){
	var applianceParams = pickParams(params);
	var appliance       = new Appliance(applianceParams);
	appliance.save(function(err, appliance){
		if (err){return callback(err);}
		Model.findById(appliance.model_id, function(err, model){
			if (err){return callback(err);}
			model.appliances.push(appliance);
			model.save(function(err, model){
				if (err){return callback(err);}
			});
		});
		callback(null, appliance);
	});
};
// Get all appliances
// ------------------
ApplianceModel.prototype.findAll = function(callback){
	Appliance.find({}, function(err, appliances){
		if (err){return callback(err);}
		async.each(appliances, function(appliance, cb){
			appliance.populate({
				path  : 'model_id',
				select: 'brand model category subcategory _id'
			}, function(err, appliance){
				cb(null, appliance);
			});
		}, function(err, results){
			if (err){return callback(err);}
			// Return the populated service request
			callback(null, appliances);
		});
	});
};
// Update appliance by id
// ----------------------
ApplianceModel.prototype.updateById = function(id, params, callback){
	var object = pickParams(params);
	Appliance.findById(id, function(err, appliance){
		if (err){return callback(err);}
		var oldModel = appliance.model_id;
		var newModel = object.model_id;
		if (oldModel !== newModel){
			Model.switchAppliancesId(oldModel, newModel, appliance._id);
		}
		appliance.update(object, function(err, result){
			if (err){return callback(err);}
			callback(null, null);
		});
	});
};
// Show appliance
// --------------
ApplianceModel.prototype.show = function(id, callback){
	console.log(id);
	Appliance.findById(id, function(err, appliance){
		if (err){return callback(err);}
		if (appliance === null){return callback();}
		appliance.populate({
			path  : 'model_id',
			select: 'brand model category subcategory _id'
		}, function(err, appliance){
			callback(null, appliance);
		});
	});
};
// =======
// EXPORTS
// =======
exports.ApplianceModel = ApplianceModel;