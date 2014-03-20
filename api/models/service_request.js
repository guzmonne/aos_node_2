// ===================
// MODULE DEPENDENCIES
// ===================
var mongoose       = require('mongoose');
var autoIncrement  = require('mongoose-auto-increment');
var timestamps     = require('mongoose-timestamp');
var async          = require('async');
var ApplianceModel = require('../models/appliance').ApplianceModel;
var Appliance      = new ApplianceModel();

// =======
// SCHEMAS
// =======
var Schema   = mongoose.Schema;

var ServiceRequest = new Schema({
	'client_name'  : String,
	'client_id'    : String,
	'status'       : String,
	'invoiceNumber': String,
	'appliances'   : [{
		type: Schema.Types.ObjectId,
		ref: 'Appliance',
	}],
	'createdBy'    : String,
	'updatedBy'    : String,
	'closedAt'     : Date,
});

// =======
// PLUGINS
// =======
// Timestamps
// ----------
ServiceRequest.plugin(timestamps);
// AutoIncrement ID
// ----------------
ServiceRequest.plugin(autoIncrement.plugin, {
    model: 'ServiceRequest',
    field: 'id',
    startAt: 1,
});

// =====
// MODEL
// =====
mongoose.model('ServiceRequest', ServiceRequest);
var ServiceRequest = mongoose.model('ServiceRequest');

// ==================
// EXPORT CONSTRUCTOR
// ==================
ServiceRequestModel = function(){};
// FUNCTIONS
// ---------
// Create new service request
// --------------------------
ServiceRequestModel.prototype.create = function(params, callback){
	var service_request = new ServiceRequest({
		'client_name'  : params['client_name'],  
		'client_id'    : params['client_id'],    
		'status'       : params['status'],       
		'invoiceNumber': params['invoiceNumber'],
		'createdBy'    : params['createdBy'],    
		'updatedBy'    : params['updatedBy'],    
	});
	service_request.save(function(err, service_request){
		if (err){return callback(err);}
		if (!params['appliances']){return callback(null, service_request);}
		async.each(params['appliances'], function(applianceParams, cb){
			applianceParams['service_request_id'] = service_request['_id'];
			Appliance.create(applianceParams, function(err, appliance){
				service_request.appliances.push(appliance);
				cb(null, appliance);
			});
		}, function(err, results){
			if (err){return callback(err);}
			service_request.save(function(err, service_request){
				if (err){return callback(err);}
				service_request.populate({
					path: 'appliances'
				}, function(err, s_r){
					if(err){return callback(err);}
					callback(null, s_r);
				});
			});
		});
	});
};
// Find all service requests
// -------------------------
ServiceRequestModel.prototype.findAll = function(callback){
	ServiceRequest.find({}, function(err, service_requests){
		if(err){return callback(err);}
		callback(null, service_requests);
	});
};
// Find all service requests from client
// -------------------------------------
ServiceRequestModel.prototype.findByClientId = function(client_id, callback){
	ServiceRequest.find({'client_id': client_id}, function(err, service_requests){
		if(err){return callback(err);}
		ServiceRequest.populate(service_requests, {
			path: 'appliances'
		}, function(err, s_r){
			if(err){return callback(err);}
			callback(null, s_r);
		});
	});
};
// Show Service Request by ID
// --------------------------
ServiceRequestModel.prototype.show = function(id, callback){
	ServiceRequest.findById(id, function(err, sr){
		if(err){return callback(err);}
		sr.populate({path: 'appliances'}, function(err, s_r){
			if(err){return callback(err);}
			callback(null, s_r);
		});
	});
};
// =======
// EXPORTS
// =======
exports.ServiceRequestModel = ServiceRequestModel;