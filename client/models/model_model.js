App.Models.Model = App.Models.BaseModel.extend({
	name: 'model',

	defaults: function(){
		return {
			'createdBy'  : 'Guzmán Monné',
			'updatedBy'  : 'Guzmán Monné'
		};
	},

	parse: function(response){
		var self = this;
		if (!App.defined(response)){return;}
		var appliances  = (response.appliances) ? response.appliances : [];
		var id          = (response._id)        ? response._id        : "";
		var objectArray;
		if (appliances){
			this.set('appliancesCount', appliances.length);
			for (i = 0; i < appliances.length; i++){
				if (!_.isObject(appliances[i])){
					objectArray = false;
					break;
				}
				objectArray = true;
			}
			if (objectArray){
				this.createChilds({id: id});
				_.each(appliances, function(attr){
					appliance       = new App.Models.Appliance(attr);
					appliance.model = self;
					self.appliances.add(appliance);
				});
			}
			delete response.appliances;
		}
		return response;
	},

	createChilds: function(options){
		if (this.appliances){return;}
		var id = (this.id)    ? this.id    : "";
		if (options && options.id){
			id = options.id;
		}
		this.appliances = new App.Collections.Appliances();
		this.appliances.setParent(this);
		this.appliances.modelFilter = {
			model_id: id,
		};
	},
});