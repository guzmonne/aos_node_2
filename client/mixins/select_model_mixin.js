// !!!
// Type: Mixin
// -----
// Description:
// ------------
// This mixin has the necessary functions to be able to select the model from a modal
// view. Is important to add the necessary events that will trigger this functions.
// ------------ 
// !!!
App.Mixins.SelectModel = {
	// !!!
	// Type: Void
	// -----
	// Description:
	// ------------
	// This method calls the modal controller to display an index view of the models.
	// ------------ 
	// !!!
	selectModel: function(e){
		if(e){e.preventDefault();}
		if(!this.modelSelectModalView){
			this.modelSelectModalView = new App.Views.ModelSelectModalView();
		}
		app.modalController.displayModal(this.modelSelectModalView, this, 'modelSelected');
	},

	// !!!
	// Type: Void
	// -----
	// Description:
	// ------------
	// This function should be triggered by an appEvent. When called the model is picked up
	// and added to the current view model.
	// ------------ 
	// !!!
	modelSelected: function(model){
		if(!this.model.prevModelId){ this.model.prevModelId = this.model.get('model_id'); }
		this.model.set('model_id', model.id);
	},

	// !!!
	// Type: Object
	// -----
	// Description:
	// ------------
	// Serializes the model and passes the information of the model to the template for easy
	// rendering.
	// ------------ 
	// !!!
	serialize: function(){
		var object = this.model.toJSON();
		var model  = this.model.model_id;
		if (model){
			_.extend(object, model.pick('brand', 'category', 'subcategory', 'model'));
		}
		return object;
	},

	setModelDetails: function(){
		try {
			var model = app.storage.getModel('models', this.model.get('model_id'), {fetch: false});
			this.$('[name=brand]'      ).val(model.get('brand'));
			this.$('[name=model]'      ).val(model.get('model'));
			this.$('[name=category]'   ).val(model.get('category'));
			this.$('[name=subcategory]').val(model.get('subcategory'));
		} catch (err) {
			if (err.message !== 'An "id" must be passed'){console.log(err.stack);}
			return;
		}
	},

	setAccessories: function(){
		var self = this;
		var accessories = this.model.get('accessories');
		_.each(accessories, function(accessory){
			self.$('[name=accessories]').tagsinput("add", accessory);
		});
	},
};