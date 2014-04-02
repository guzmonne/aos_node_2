// ===================
// MODULE DEPENDENCIES
// ===================
var mongoose      = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');
var timestamps    = require('mongoose-timestamp');

// =======
// SCHEMAS
// =======
var Schema   = mongoose.Schema;

var Appliance = new Schema({
	'model'           : String,
	'brand'           : String,
	'serial'          : String,
	'category'        : String,
	'subcategory'     : String,
	'accessories'     : [String],
	'client_name'     : String,
	'client_id'       : String,
	'repairement_type': String,
	'defect'          : String,
	'observations'    : String,
	'status'          : String,
	'cost'            : {
		type: Number,
		min : [0, 'El costo no puede ser menor que 0'],
	},
	'solution'          : String,
	'diagnose'          : String,
	'replacements'      : [String],
	'inStock'           : Boolean,
	'departuredAt'      : Date,
	'repairedAt'        : Date,
	'technician_name'   : String,
	'technician_id'     : String,
	'createdBy'         : String,
	'updatedBy'         : String,
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
function fillObject(params){
	var date = new Date();
	var result = {
		'model'             : params['model'],
		'brand'             : params['brand'],
		'serial'            : params['serial'],
		'category'          : params['category'],
		'subcategory'       : params['subcategory'],
		'client_name'       : params['client_name'],
		'client_id'         : params['client_id'],
		'repairement_type'  : params['repairement_type'],
		'defect'            : params['defect'],
		'observations'      : params['observations'],
		'status'            : params['status'],
		'cost'              : params['cost'],
		'solution'          : params['solution'],
		'diagnose'          : params['diagnose'],
		'replacements'      : params['replacements'],
		'inStock'           : params['inStock'],
		'departuredAt'      : params['departuredAt'],
		'repairedAt'        : params['repairedAt'],
		'technician_name'   : params['technician_name'],
		'technician_id'     : params['technician_id'],
		'createdBy'         : params['createdBy'],
		'updatedBy'         : params['updatedBy'],
		'service_request_id': params['service_request_id'],
		'accessories'       : params['accessories'],
		'updatedAt'         : date,
	}
	if (!params['_id']){
		result.createdAt = date;
	}
	return result;
}
// Create new appliance
// --------------------
ApplianceModel.prototype.create = function(params, callback){
	var object = fillObject(params);
	var appliance = new Appliance(object);
	appliance.save(function(err, appliance){
		if (err){return callback(err);}
		callback(null, appliance);
	});
};
// Get all appliances
// ------------------
ApplianceModel.prototype.findAll = function(callback){
	Appliance.find({}, function(err, appliances){
		if (err){return callback(err);}
		callback(null, appliances);
	});
};
// Update appliance by id
ApplianceModel.prototype.updateById = function(id, params, callback){
	var object = fillObject(params);
	Appliance.findByIdAndUpdate(id, object, function(err, appliance){
		if (err){return callback(err);}
		callback(null, appliance);
	});
};
// =========
// FUNCTIONS
// =========

// =======
// EXPORTS
// =======
exports.ApplianceModel = ApplianceModel;