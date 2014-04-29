App.Models.ServiceRequest = App.Models.BaseModel.extend({
	urlRoot: '/api/service_requests',

	initialize: function(attributes, options){
		if(!App.defined(this.appliances)){
			this.appliances = new App.Collections.Appliances();
		}
		if(App.defined(attributes) && App.defined(attributes.appliances)){
			this.appliances.reset(attributes.appliances);
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
		attributes.appliances = this.appliances.toJSON();
		return attributes;
	},
});