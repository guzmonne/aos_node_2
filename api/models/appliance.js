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
	'model'          : String,
	'brand'          : String,
	'serial'         : String,
	'category'       : String,
	'subcategory'    : String,
	'accessories'    : [String],
	'client_name'    : String,
	'client_id'      : String,
	'repirement_type': String,
	'defect'         : String,
	'observations'   : String,
	'status'         : String,
	'cost'           : {
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
		ref: 'ServiceRequest'
	}
});

// =======
// PLUGINS
// =======
// Timestamps
// ----------
Appliance.plugin(timestamps);
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
ApplianceModel.prototype.create = function(params, callback){
	var appliance = new Appliance({
		'model'             : params['model'],
		'brand'             : params['brand'],
		'serial'            : params['serial'],
		'category'          : params['category'],
		'subcategory'       : params['subcategory'],
		'client_name'       : params['client_name'],
		'client_id'         : params['client_id'],
		'repairment_type'   : params['repairment_type'],
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
	});
	for(var i = 0; i < params['accessories'].length; i++){
		appliance.accessories.push(params['accessories'][i]);
	}
	appliance.save(function(err, appliance){
		if (err){return callback(err);}
		callback(null, appliance);
	});
};
// =======
// EXPORTS
// =======
exports.ApplianceModel = ApplianceModel;