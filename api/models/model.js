// ===================
// MODULE DEPENDENCIES
// ===================
var mongoose      = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');

// =======
// SCHEMAS
// =======
var Schema   = mongoose.Schema;

var Model = new Schema({
	'model'      : String,
	'brand'      : String,
	'serial'     : String,
	'category'   : String,
	'subcategory': String,
	'createdBy'  : String,
	'updatedBy'  : String,
	'createdAt'  : Date,
	'updatedAt'  : Date,
	'appliances'   : [{
		type: Schema.Types.ObjectId,
		ref: 'Appliance',
	}],
});

// =======
// PLUGINS
// =======
// AutoIncrement ID
// ----------------
Appliance.plugin(autoIncrement.plugin, {
    model: 'Model',
    field: 'id',
    startAt: 1,
});

// =====
// MODEL
// =====
mongoose.model('Model', Model);
var Model = mongoose.model('Model');

// ==================
// EXPORT CONSTRUCTOR
// ==================
ModelModel = function(){};
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
		'updatedBy'					: params['updatedBy'],
		'updatedAt'         : date,
	}
	if (!params['_id']){
		result.createdAt = date;
	}
	return result;
}
// Create new model
// --------------------
ModelModel.prototype.create = function(params, callback){
	var object = fillObject(params);
	var model = new Model(object);
	model.save(function(err, model){
		if (err){return callback(err);}
		callback(null, model);
	});
};
// Get all models
// ------------------
ModelModel.prototype.findAll = function(callback){
	Model.find({}, function(err, models){
		if (err){return callback(err);}
		callback(null, models);
	});
};
// Update model by id
ModelModel.prototype.updateById = function(id, params, callback){
	var object = fillObject(params);
	Model.findByIdAndUpdate(id, object, function(err, model){
		if (err){return callback(err);}
		callback(null, model);
	});
};
// =========
// FUNCTIONS
// =========

// =======
// EXPORTS
// =======
exports.ModelModel = ModelModel;