App.Models.Client = App.Models.BaseModel.extend({
	urlRoot: '/clients',

	defaults: function(){
		return {
			'id'  : this.cid,
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