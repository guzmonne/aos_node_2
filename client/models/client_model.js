App.Models.Client = App.Models.BaseModel.extend({
	urlRoot: '/clients',

	defaults: function(){
		return {
			'id'  : null,
			'name': '',
			'doc' : {
				'type'  : '',
				'number': ''
			},
			'phones'   : [],
			'addresses': [],
			'email'    : '',
			'createdAt': new Date(),
			'updatedAt': new Date(),
			'createdBy': 'Guzmán Monné',
			'updatedBy': 'Guzmán Monné'
		};
	},
});