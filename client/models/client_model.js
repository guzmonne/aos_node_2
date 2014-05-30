App.Models.Client = App.Models.BaseModel.extend({
	urlRoot: '/api/clients',
	name   : 'client',

	defaults: function(){
		return {
			'createdBy' : 'Guzmán Monné',
			'updatedBy' : 'Guzmán Monné'
		};
	},
});