App.Models.Appliance = App.Models.BaseModel.extend({
	urlRoot: '/api/appliances',
	name   : 'appliance',

	defaults: function(){
		return {
			'status'            : 'Pendiente',
			'createdBy'         : 'Guzman Monne',
			'updatedBy'         : 'Guzman Monne',
		};
	},
});