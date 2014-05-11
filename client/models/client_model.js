App.Models.Client = App.Models.BaseModel.extend({
	urlRoot: '/api/clients',
	name   : 'client',

	defaults: function(){
		return {
			'createdBy' : 'Guzmán Monné',
			'updatedBy' : 'Guzmán Monné'
		};
	},

	childs: [
		{
			attribute: 'phones',
			type: 'collection',
			name: 'Phones'
		},
		{
			attribute: 'addresses',
			type: 'collection',
			name: 'Addresses',
		}
	],
});

App.Models.Phone = App.Models.BaseModel.extend({
	name: 'phone',
	defaults: function(){
		return {
			number: '',
		};
	},
});

App.Models.Address = App.Models.BaseModel.extend({
	name: 'address',
	defaults: function(){
		return {
			street    : '',
			city      : '',
			department: '',
		};
	},
});