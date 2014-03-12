App.Models.Client = App.Models.BaseModel.extend({
	urlRoot: '/clients',

	defaults: function(){
		return {
			'id'       : null,
			'name'     : '',
			'email'    : '',
			'doc'      : new App.Models.Doc(),
			'phones'   : new App.Collections.Phones(),
			'addresses': new App.Collections.Addresses(),
			'createdAt': new Date(),
			'updatedAt': new Date(),
			'createdBy': 'Guzmán Monné',
			'updatedBy': 'Guzmán Monné'
		};
	},

	initialize: function(attributes, options){
		if (attributes !== undefined && attributes !== null){
			this.parseAttributes(attributes);
		}
	},

	parseAttributes: function(attributes){
		if(attributes.phones !== undefined && attributes.phones !== null){
			if(_.isArray(attributes.phones)){
				this.set('phones', new App.Collections.Phones(attributes.phones));
			}
		}
		if(attributes.addresses !== undefined && attributes.addresses !== null){
			if(_.isArray(attributes.addresses)){
				this.set('addresses', new App.Collections.Addresses(attributes.addresses));
			}
		}
		if(attributes.doc.type !== undefined && attributes.doc.type !== null){
			if (this.get('doc') instanceof(App.Models.BaseModel)){
				this.get('doc').set('type', attributes.doc.type);
			} else {
				this.set('doc', new App.Models.Doc({type: attributes.doc.type}));
			}
		}
		if(attributes.doc.number !== undefined && attributes.doc.number !== null){
			if (this.get('doc') instanceof(App.Models.BaseModel)){
				this.get("doc").set('number', attributes.doc.number);
			} else {
				this.set('doc', new App.Models.Doc({type: attributes.doc.number}));
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
		if(attributes.doc instanceof(Giraffe.Model)){
			attributes.doc = attributes.doc.toJSON();
		}
		return attributes;
	},
});

App.Models.Doc = App.Models.BaseModel.extend({
	defaults: function(){
		return {
			type  : '',
			number: '',
		};
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