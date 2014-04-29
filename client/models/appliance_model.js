App.Models.Appliance = App.Models.BaseModel.extend({
	urlRoot: '/api/appliances',

	defaults: function(){
		return {
			'repairment_type'   : 'Garantía',
			'status'            : 'Pendiente',
			'createdBy'         : 'Guzman Monne',
			'updatedBy'         : 'Guzman Monne',
		};
	},
});