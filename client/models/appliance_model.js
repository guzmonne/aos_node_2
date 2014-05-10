App.Models.Appliance = App.Models.BaseModel.extend({
	urlRoot: '/api/appliances',
	name   : 'appliance',

	defaults: function(){
		return {
			'status'            : 'Pendiente',
			'createdBy'         : 'Guzman Monne',
			'updatedBy'         : 'Guzman Monne',
		};
	},

	awake: function(options){
		this.setModel(options);
	},

	customUpdate: function(otherModel){
		this.set(otherModel.attributes, {silent: true});
		this.model = otherModel.model;
	},

	parse: function(response){
		var result = this.setModel(response);
		return result;
	},

	childUpdated: function(){
		this.trigger('updated');
	},

	setModel: function(response){
		var result      = (response) ? response : null;
		var modelParams = {};
		if (result){
			if (_.isObject(result.model_id)){
				modelParams = result.model_id;
				if (result.model_id._id){
					result.model_id = result.model_id._id;
				}
			}
		}		
		if (this.model){
			this.model.set(modelParams);
		} else {
			var model  = new App.Models.Model(modelParams);
			this.model = model;
			this.listenTo(this.model, 'updated', this.childUpdated);
		}
		return result;
	},
});