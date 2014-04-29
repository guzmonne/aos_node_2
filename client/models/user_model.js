App.Models.User = App.Models.BaseModel.extend({
	urlRoot: '/api/users',

	defaults: function(){
		return {
			'createdBy'  : 'Guzmán Monné',
			'updatedBy'  : 'Guzmán Monné',
		};
	},
});