App.Models.ServiceRequest = App.Models.BaseModel.extend({
	urlRoot: '/api/service_requests',

	awake: function(attributes, options){
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

	childs: [
		{
			attribute: 'appliances',
			type: 'collection',
			filter: function(){
				return {service_request_id: this.id};
			}
		},
	],

	serialize: function(){
		var attributes = this.toJSON();
		attributes.appliances = this.appliances.toJSON();
		return attributes;
	},
});