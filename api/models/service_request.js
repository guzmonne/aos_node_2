// ===================
// MODULE DEPENDENCIES
// ===================
var mongoose       = require('mongoose');
var autoIncrement  = require('mongoose-auto-increment');
var timestamps     = require('mongoose-timestamp');
var async          = require('async');
var ApplianceModel = require('../models/appliance').ApplianceModel;
var Appliance      = new ApplianceModel();
var ClientModel    = require('../models/client').ClientModel;
var Client         = new ClientModel();

// =======
// SCHEMAS
// =======
var Schema   = mongoose.Schema;

var ServiceRequest = new Schema({
	'client_name'  : String, 
	'client_id'    : {
		type: Schema.Types.ObjectId,
		ref : 'Client'
	},
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
	// Save Service Request
	service_request.save(function(err, service_request){
		if (err){return callback(err);}
		// Find Client to add the new service request
		Client.show({_id: service_request['client_id']}, function(err, client){
			if(err){return callback(err);}
			// Push the service request to the client model
			client.service_requests.push(service_request);
			// Save the updated client model
			client.save(function(err, client){
				if(err){return callback(err);}
			});
		});
		// If there are no appliances for this service request then return
		if (!params['appliances']){return callback(null, service_request);}
		// Save all the appliances in parallel asynchronously
		// async.each([array], function(array_element, callback()))
		async.each(params['appliances'], function(applianceParams, cb){
			// Set the service_request_id parameter for the appliance
			applianceParams['service_request_id'] = service_request['_id'];
			// Create the appliance passing the appliance parameters
			Appliance.create(applianceParams, function(err, appliance){
				// Push the created appliance to the service request created before
				// This is necessary to populate it at the end before returning
				service_request.appliances.push(appliance);
				// Async.Each uses this callback to check when the tasks end
				cb(null, appliance);
			});
		// This function gets run wen all the async functions finish
		}, function(err, results){
			if (err){return callback(err);}
			// We save the service request with all the freshly created appliances
			service_request.save(function(err, service_request){
				if (err){return callback(err);}
				// We populate them to return them to the client
				service_request.populate({
					path: 'appliances'
				}, function(err, s_r){
					if(err){return callback(err);}
					async.each(s_r.appliances, function(appliance, cb){
						appliance.populate({
							path  : 'model_id',
							select: 'brand model category subcategory -_id'
						}, function(err, appliance){
							cb(null, appliance);
						});
					}, function(err, results){
						if (err){return callback(err);}
						// Return the populated service request
						callback(null, s_r);
					});
				});
			});
		});
	});
};
// Find all service requests
// -------------------------
ServiceRequestModel.prototype.findAll = function(callback){
	ServiceRequest.find({}, function(err, sr){
		if(err){return callback(err);}
		if(sr === null){return callback({msg: 'No ServiceRequest found'});}
		callback(null, sr);
	});
};
// Find all service requests from client
// -------------------------------------
ServiceRequestModel.prototype.findByClientId = function(client_id, callback){
	ServiceRequest.find({'client_id': client_id}, function(err, service_requests){
		if(err){return callback(err);}
		if(service_requests === null){return callback({msg: 'No ServiceRequest found'});}
		callback(null, service_requests);
		//ServiceRequest.populate(service_requests, {
		//	path: 'appliances'
		//}, function(err, s_r){
		//	if(err){return callback(err);}
		//	callback(null, s_r);
		//});
	});
};
// Show Service Request by ID
// --------------------------
ServiceRequestModel.prototype.show = function(id, callback){
	ServiceRequest.findById(id, function(err, sr){
		if(err){return callback(err);}
		if(sr === null){return callback({msg: 'No ServiceRequest found'});}
		sr.populate({
			path: 'appliances'
		}, function(err, s_r){
			if(err){return callback(err);}
			async.each(s_r.appliances, function(appliance, cb){
				appliance.populate({
					path  : 'model_id',
					select: 'brand model category subcategory -_id'
				}, function(err, appliance){
					cb(null, appliance);
				});
			}, function(err, results){
				if (err){return callback(err);}
				// Return the populated service request
				callback(null, s_r);
			});
			//callback(null, s_r);
		});
	});
};
// =======
// EXPORTS
// =======
exports.ServiceRequestModel = ServiceRequestModel;