// ===================
// MODULE DEPENDENCIES
// ===================
var mongoose      = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');
var _             = require('underscore');

// =======
// SCHEMAS
// =======
var Schema   = mongoose.Schema;

var Model = new Schema({
	'model'      : String,
	'brand'      : String,
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
Model.plugin(autoIncrement.plugin, {
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
ModelModel.prototype.findAll = function(fields, callback){
	var query = Model.find({});
	if (arguments.length > 1 && _.isString(fields)){
		query.select(fields);
	}
	query.exec(function(err, models){
		if (err){return callback(err);}
		callback(null, models);
	});
};
// Update model by id
ModelModel.prototype.updateById = function(id, params, callback){
	var object = fillObject(params);
	Model.findByIdAndUpdate(id, object, function(err, model){
		if (err){return callback(err);}
		callback();
	});
};
// Find model by id 
ModelModel.prototype.findById = function(id, fields, callback, options){
	var query = Model.findById(id);
	// The id must be a string
	if (!id || !_.isString(id)){return;}
	// Since we can call this function passing different parameters we need to check
	// how it was called
	switch (arguments.length){
		// If only one argument then return
		case 1:
			return;
			break;
		// If a function was not passed as the second parameter then return
		case 2:
			if (_.isFunction(fields)){
				callback = fields;
				fields   = null;
			} else {
				return;
			}
			break;
		// The only two options allowed are for a string of 'fields' and the callback, or 
		// the 'callback' plus an 'options' object
		case 3:
			if (_.isFunction(fields) && _.isObject(callback)){
				options  = callback;
				callback = fields;
				fields   = null;
			} else if ( !(_.isString(fields) && _.isFunction(callback)) ){
				return;
			}
			break;
		// We check that 'fields' is a string, 'callback' a function and options an 'object'
		case 4:
			if (!_.isString(fields) || !_.isFunction(callback) || !_.isObject(options)){
				return;
			}
			break;
	}
	console.log(id, fields, callback, options);
	//if (arguments.length > 2 && _.isString(fields)){
	//	query.select(fields);
	//} else if (arguments.length === 2 && _.isFunction(fields)){
	//	callback = fields;
	//}
	// If the 'fields' argument was passed then we passed the filter to the query
	if (_.isString(fields)){
		query.select(fields);
	}
	// The query is executed
	query.exec(function(err, model){
		if (err){return callback(err);}
		// if an options object is passed with the populate argumemt set to true then we
		// populate the model with its appliances, else we just return it
		if (_.isObject(options) && options.populate === true){
			model.populate({
				path  : 'appliances',
			}, function(err, model){
				callback(null, model);
			});
		} else {
			callback(null, model);
		}
	});
};

// Changes an appliance from one model to another.
ModelModel.prototype.switchAppliancesId = function(oldModel, newModel, appliance_id){
	Model.update({_id: oldModel}, {$pull: {appliances: appliance_id}}, function(err, result){
		if(err){callback(err);}
	});
	Model.update({_id: newModel}, {$push: {appliances: appliance_id}}, function(err, result){
		if(err){callback(err);}
	});
};

// =======
// EXPORTS
// =======
exports.ModelModel = ModelModel;