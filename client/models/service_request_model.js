App.Models.ServiceRequest = App.Models.BaseModel.extend({
	urlRoot: '/api/service_requests',

	defaults: function(){
		return {
			'client_name'  : null,
			'client_id'    : null,
			'status'       : 'Pendiente',
			'createdAt'    : null,
			'updatedAt'    : null,
			'invoiceNumber': null,
			'appliances'   : new App.Collections.Appliances(),
			'createdBy'    : 'Guzmán Monné',
			'updatedBy'    : 'Guzmán Monné',
		};
	},

	serialize: function(){
		var attributes = this.toJSON();
		if(attributes.appliances instanceof(Giraffe.Collection)){
			attributes.appliances = attributes.appliances.toJSON();
		}
		return attributes;
	},
});