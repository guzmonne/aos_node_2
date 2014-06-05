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

var User = new Schema({
	'name'       : String,
	'email'      : {
		type     : String,
		lowercase: true,
		trim     : true,
		unique   : true
	},
	'permissions': {
		'roles': {
			'isTech' : Boolean,
			'isAdmin': Boolean,
		}
	},
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
User.plugin(autoIncrement.plugin, {
    model: 'User',
    field: 'id',
    startAt: 1,
});

// =====
// MODEL
// =====
mongoose.model('User', User);
var User = mongoose.model('User');

// ==================
// EXPORT CONSTRUCTOR
// ==================
UserModel = function(){};
// FUNCTIONS
// ---------
// Fill object
function pickParams(params){
	var date = new Date();
	var result = _.pick(params, 
			'name'
		,	'email'
		,	'permissions'
	);
	result.updatedAt = date;
	if (!params['_id']){
		result.createdAt = date;
	}
	return result;
}
// Create new user
// ---------------
UserModel.prototype.create = function(params, callback){
	var object = pickParams(params);
	var model = new User(object);
	model.save(function(err, model){
		if (err){return callback(err);}
		callback(null, model);
	});
};
// Get all users
// -------------
UserModel.prototype.findAll = function(fields, callback){
	var query = User.find({});
	if (arguments.length > 1 && _.isString(fields)){
		query.select(fields);
	}
	query.exec(function(err, models){
		if (err){return callback(err);}
		callback(null, models);
	});
};
// Get all users with role technician
UserModel.prototype.findTechnicians = function(callback){
	User.find({"permissions.roles.isTech": true})
		.select("-service_requests")
		.exec(function(err, users){
			if (err){return callback(err);}
			callback(null, users);
		});
};
// Update model by id
UserModel.prototype.updateById = function(id, params, callback){
	var object = pickParams(params);
	User.findByIdAndUpdate(id, object, function(err, model){
		if (err){return callback(err);}
		callback(null, model);
	});
};
// Find model by id
UserModel.prototype.findById = function(id, fields, callback){
	var query = User.findById(id);
	if (arguments.length > 2 && _.isString(fields)){
		query.select(fields);
	} else if (arguments.length === 2 && _.isFunction(fields)){
		callback = fields;
	}
	query.exec(function(err, model){
		if (err){return callback(err);}
		callback(null, model);
	});
};
// Changes an appliance from one user to another.
UserModel.prototype.switchTechniciansId = function(oldUser, newUser, appliance_id, callback){
	User.update({_id: oldUser}, {$pull: {appliances: appliance_id}}, function(err, result){
		if(err){callback(err);}
	});
	User.update({_id: newUser}, {$push: {appliances: appliance_id}}, function(err, result){
		if(err){callback(err);}
	});
};
// =======
// EXPORTS
// =======
exports.UserModel = UserModel;
exports.User = new UserModel();