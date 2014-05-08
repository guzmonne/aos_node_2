App.Collections.ServiceRequests = App.Collections.BaseCollection.extend({
	model    : App.Models.ServiceRequest,
	modelName: 'service_request',

	// !!!
	// Type: String
	// -----
	// Description:
	// ------------
	// If the collection has a client_id parameter then we call for only the service_requests
	// assigned to that client
	// ------------ 
	// !!!
	url  : function(){
		var u = '/api/' + this.modelName;
		if (this.client_id){
			u = u + '/client/' + this.client_id;
		}
		return u;
	},

	customModelAdd: function(attrs){
		var model = new this.model(attrs);
		console.log(model);
		return this.add(model);
	},
});