App.Models.Appliance = App.Models.BaseModel.extend({
	name   : 'appliance',

	defaults: function(){
		return {
			'status'            : 'Pendiente',
			'createdBy'         : 'Guzman Monne',
			'updatedBy'         : 'Guzman Monne',
		};
	},

	// !!!
	// Type: Void
	// -----
	// Description:
	// ------------
	// On awake we initialize the 'model' model.
	// ------------ 
	// !!!
	awake: function(attributes, options){
		if (attributes){
			this.setModel(attributes);
		}
	},

	// !!!
	// Type: Void
	// -----
	// Description:
	// ------------
	// When the model catches an 'updated' event an its needed
	// to update the model data, it is done with this function.
	// The new attributes are set and the models are exchanged.
	// ------------ 
	// !!!
	customUpdate: function(otherModel){
		this.set(otherModel.attributes, {silent: true});
		//this.model.dispose();
		this.model = otherModel.model;
	},

	parse: function(response){
		var result = this.setModel(response);
		return result;
	},

	// !!!
	// Type: Object
	// -----
	// Description:
	// ------------
	// We creata a model object from the response data. We also save
	// the model_id info as a String instead of an object.
	// ------------ 
	// Arguments:
	// ----------
	// response [Object]: response from the server of the appliance
	// model. Inside the model_id attribute comes the information 
	// about the appliance model for easy rendering.
	// ----------
	// !!!
	setModel: function(response){
		var result      = (response) ? _.clone(response) : null;
		var modelParams = {};
		if (result){
			// model_id can be an object since we use Mongoose populate method
			// to fill the model info on the server. Here we took that object
			// store it into the modelParams function and save the result.model_id
			// into a String.
			if (_.isObject(result.model_id)){
				modelParams = _.clone(result.model_id);
				if (result.model_id._id){
					result.model_id = result.model_id._id;
				}
			}
		}		
		this.createChilds();
		this.model.set(modelParams);
		return result;
	},

	createChilds: function(options){
		if (this.model){return;}
		this.model = new App.Models.Model();
		this.model.setParent(this);
		this.listenTo(this.model, 'updated', this.childUpdated);
	},

	// !!!
	// Type: Void
	// -----
	// Description:
	// ------------
	// Call the 'updated' event on thid model
	// ------------ 
	// !!!
	childUpdated: function(){
		this.trigger('updated');
	},
});