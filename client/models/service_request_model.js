App.Models.ServiceRequest = App.Models.BaseModel.extend({
	urlRoot: '/api/service_requests',

	defaults: function(){
		return {
			'client_name'  : null,
			'client_id'    : null,
			'status'       : null,
			'createdAt'    : null,
			'updatedAt'    : null,
			'invoiceNumber': null,
			'appliances'   : new App.Collections.Appliances(),
			'createdBy'    : 'Guzmán Monné',
			'updatedBy'    : 'Guzmán Monné',
		};
	},
});