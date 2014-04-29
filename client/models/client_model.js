App.Models.Client = App.Models.BaseModel.extend({
	urlRoot: '/api/clients',

	defaults: function(){
		return {
			'phones'    : new App.Collections.Phones(),
			'addresses' : new App.Collections.Addresses(),
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
				this.set('phones', new App.Collections.Phones(attributes.phones), {silent: true});
				delete attributes.phones;
			}
		}
		if(App.defined(attributes.addresses)){
			if(_.isArray(attributes.addresses)){
				this.set('addresses', new App.Collections.Addresses(attributes.addresses), {silent: true});
				delete attributes.addresses;
			}
		}
		return attributes;
	},

	parse: function(response){
		if (this.id === undefined){
			return response;
		} else {
			return this.parseAttributes(response);
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