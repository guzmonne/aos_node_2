App.Models.ServiceRequest = App.Models.BaseModel.extend({
	name: 'service_request',

	defaults: function(){
		return {
			'status'        : 'Pendiente',
			'createdBy'     : 'Guzmán Monné',
			'updatedBy'     : 'Guzmán Monné',
		};
	},

	//awake: function(attributes, options){
	//	if (attributes){
	//		this.parse(attributes);
	//	}
	//},

	parse: function(response){
		if (!App.defined(response)){return;}
		var self = this;
		var appliances  = (response.appliances) ? _.clone(response.appliances) : [];
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
				this.createChilds();
				this.appliances.reset(appliances, {silent: true});
			}
			delete response.appliances;
		}
		return response;
	},

	serialize: function(){
		var attributes = this.toJSON();
		if (this.appliances){
			attributes.appliances = this.appliances.toJSON();
		}
		return attributes;
	},

	createChilds: function(options){
		if (this.appliances){return;}
		var id = (this.id) ? this.id : "";
		if (options && options.id){
			id = options.id;
		}
		this.appliances = new App.Collections.Appliances();
		this.appliances.setParent(this);
		this.appliances.modelFilter = {
			service_request_id: id,
		};
	},

	//beforeSuccessfulCreate: function(){
	//	this.createChilds();
	//},

	//afterSuccessfulCreate: function(attrs){
	//	var model;
	//	if (attrs.appliances){
	//		_.each(attrs.appliances, function(appliance){
	//			app.trigger('appliance:model:created', appliance);
	//		});
	//	}
	//},
});