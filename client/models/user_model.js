App.Models.User = App.Models.BaseModel.extend({
	urlRoot: '/api/users',

	defaults: function(){
		return {
			'name'       : null,
			'email'      : null,
			'createdBy'  : 'Guzmán Monné',
			'updatedBy'  : 'Guzmán Monné',
			'permissions': null,
		};
	},
});