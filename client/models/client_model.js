App.Models.Client = App.Models.BaseModel.extend({
	urlRoot: '/clients',

	defaults: {
		'name'     : '',
		'doc'      : {
			'type' : '',
			'number': ''
		},
		'phones'   : [],
		'addresses': [],
		'email'    : ''
	},
});