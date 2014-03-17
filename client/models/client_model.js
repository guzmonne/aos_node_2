App.Models.Client = App.Models.BaseModel.extend({
	urlRoot: '/api/clients',

	defaults: function(){
		return {
			'id'        : null,
			'name'      : '',
			'email'     : '',
			'doc-type'  : '',
			'doc-number': '',
			'phones'    : new App.Collections.Phones(),
			'addresses' : new App.Collections.Addresses(),
			'createdAt' : new Date(),
			'updatedAt' : new Date(),
			'createdBy' : 'Guzmán Monné',
			'updatedBy' : 'Guzmán Monné'
		};
	},

	initialize: function(attributes, options){
		if (attributes !== undefined && attributes !== null){
			this.parseAttributes(attributes);
		}
	},

	parseAttributes: function(attributes){
		if(App.defined(attributes.phones)){
			if(_.isArray(attributes.phones)){
				this.set('phones', new App.Collections.Phones(attributes.phones));
			}
		}
		if(App.defined(attributes.addresses)){
			if(_.isArray(attributes.addresses)){
				this.set('addresses', new App.Collections.Addresses(attributes.addresses));
			}
		}
	},

	serialize: function(){
		var attributes = this.toJSON();
		if(attributes.phones instanceof(Giraffe.Collection)){
			attributes.phones = attributes.phones.toJSON();
		}
		if(attributes.addresses instanceof(Giraffe.Collection)){
			attributes.addresses = attributes.addresses.toJSON();
		}
		return attributes;
	},
});

App.Models.Phone = App.Models.BaseModel.extend({
	defaults: function(){
		return {
			number: '',
		};
	},
});

App.Models.Address = App.Models.BaseModel.extend({
	defaults: function(){
		return {
			street    : '',
			city      : '',
			department: '',
		};
	},
});