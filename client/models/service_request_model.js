App.Models.ServiceRequest = App.Models.BaseModel.extend({
	urlRoot: '/api/service_requests',

	appliances: null,

	initialize: function(attributes, options){
		this.appliances = new App.Collections.Appliances();
		if(App.defined(attributes) && App.defined(attributes.appliances)){
			this.appliances.reset(attributes.appliances);
		} 
	},

	defaults: function(){
		return {
			'client_name'   : null,
			'client_id'     : null,
			'status'        : 'Pendiente',
			'createdAt'     : null,
			'updatedAt'     : null,
			'invoiceNumber' : null,
			'createdBy'     : 'Guzmán Monné',
			'updatedBy'     : 'Guzmán Monné',
			'closedAt'			: null,
		};
	},

	parse: function(response){
		if(!App.defined(this.appliances)){
			this.appliances = new App.Collections.Appliances();
		}
		if (App.defined(response.appliances)){
			this.setAppliances(response.appliances);
		}
		return response;
	},

	setAppliances: function(array){
		if (App.defined(array) && _.isArray(array)){
			this.appliances.reset(array);
		}
		return this;
	},

	serialize: function(){
		var attributes = this.toJSON();
		if(App.defined(this.appliances)){
			attributes.appliances = this.appliances.toJSON();
		}
		return attributes;
	},
});