App.Models.Model = App.Models.BaseModel.extend({
	
	url: function(){
		var u = '/api/models';
		if (this.id){
			u = u + '/' + this.id;
		}
		return u;
	},

	beforeInitialize: function(attributes, options){
		if(!App.defined(this.appliances)){
			this.appliances = new App.Collections.Appliances();
		}
	},

	parse: function(response){
		if(!App.defined(this.appliances)){
			this.appliances = new App.Collections.Appliances();
		}
		if (App.defined(response.appliances)){
			this.setAppliances(response.appliances);
		}
		return response;
	},

	setAppliances: function(array){
		var self = this;
		if (_.isArray(array)){
			this.set('appliancesCount', array.length);
			if(!_.isString(array[0])){
				_.each(array, function(appliance){
					self.appliances.add(app.pushToStorage('Appliances', appliance));
				});
			}
		}
		return this;
	},

	defaults: function(){
		return {
			'createdBy'  : 'Guzmán Monné',
			'updatedBy'  : 'Guzmán Monné'
		};
	},
});