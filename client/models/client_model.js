App.Models.Client = App.Models.BaseModel.extend({
	name   : 'client',

	defaults: function(){
		return {
			'createdBy' : 'Guzmán Monné',
			'updatedBy' : 'Guzmán Monné'
		};
	},

	createChilds: function(options){
		if (this.phones && this.addresses){return;}
		this.addresses = new App.Collections.Addresses();
		this.phones    = new App.Collections.Phones();
		this.phones.setParent(this);
		this.addresses.setParent(this);
	},

	parse: function(response){
		if (!App.defined(response)){return;}
		this.createChilds();
		if(App.defined(response.phones)){
			this.phones.set(response.phones, {silent: true});
			delete response.phones;
		}
		if(App.defined(response.addresses)){
			this.addresses.set(response.addresses, {silent: true});
			delete response.addresses;
		}
		return response;
	},

	serialize: function(){
		var attributes = this.toJSON();
		if (this.phones)   { attributes.phones    = this.phones.toJSON();      }
		if (this.addresses){ attributes.addresses = this.addresses.toJSON();}
		return attributes;
	},
});

App.Models.Phone = App.Models.BaseModel.extend({});

App.Models.Address = App.Models.BaseModel.extend({});