App.Models.Client = App.Models.BaseModel.extend({
	urlRoot: '/clients',

	defaults: {
		'name'     : '',
		'doc'      : {
			'type' : '',
			'value': ''
		},
		'phones'   : [],
		'addresses': [],
		'email'    : ''
	},
});