App.Models.BaseModel = Giraffe.Model.extend({
	// So Backbone can use the '_id' value of our Mongo documents as the documents id
	idAttribute: '_id',

	initialize: function(){
		if (_.isFunction(this.beforeInitialize)){this.beforeInitialize();}
		this.listenTo(this, 'sync'                      , this.modelUpdated);
		this.listenTo(app , this.name + ':model:updated', this.updateModel);
	},

	// When the model gets synced with the server it calls the modelUpdated function.
	// This function will then trigger a custom event to let other models know that
	// it has been updated.
	modelUpdated: function(){
		app.trigger(this.name + ':model:updated', this);
	},

	// When the model hears that a model of its kind was updated it checks if it has
	// to incorporate this new data on itself. Once its done it will run another
	// cutom event to let the views know that some changes occured.
	updateModel: function(otherModel){
		if (otherModel.cid !== this.cid && otherModel.id === this.id){
			this.set(otherModel.attributes, {silent: true});
			this.trigger('updated');
		}
	},
	
	// Just a basic function to parse a 'Date()' type.
	dateDDMMYYYY: function(date){
		var parsedDate;
		if (date instanceof Date){
			parsedDate = date;
		} else {
			parsedDate = new Date(date);
		}
		return parsedDate.getDate() +
			"/" + parsedDate.getMonth() + 
			"/" + parsedDate.getFullYear();
	},
});