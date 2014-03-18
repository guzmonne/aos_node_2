App.Models.ServiceRequest = App.Models.BaseModel.extend({
	urlRoot: '/api/service_requests',

	defaults: function(){
		return {
			'client_name': null,
			'client_id': null,
			'apparatus_qty': 0,
			'status': null,
			'createdAt': null,
			'updatedAt': null,
			'createdBy': 'Guzmán Monné',
			'updatedBy': 'Guzmán Monné',
		};
	},
});