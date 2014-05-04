App.Models.ServiceRequest = App.Models.BaseModel.extend({
	urlRoot: '/api/service_requests',

	beforeInitialize: function(attributes, options){
		if(!App.defined(this.appliances)){
			this.appliances = new App.Collections.Appliances();
		}
	},

	defaults: function(){
		return {
			'status'        : 'Pendiente',
			'createdBy'     : 'Guzmán Monné',
			'updatedBy'     : 'Guzmán Monné',
		};
	},

	parse: function(response){
		if(!App.defined(this.appliances)){
			this.appliances = new App.Collections.Appliances();
		}
		if (App.defined(response.appliances)){
			this.set('appliancesCount', response.appliances.length);
			this.appliances.reset(response.appliances);
		}
		return response;
	},

	serialize: function(){
		var attributes = this.toJSON();
		attributes.appliances = this.appliances.toJSON();
		return attributes;
	},
});