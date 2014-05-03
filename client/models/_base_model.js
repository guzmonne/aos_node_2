App.Models.BaseModel = Giraffe.Model.extend({
	idAttribute: '_id',

	initialize: function(){
		if (_.isFunction(this.beforeInitialize)){this.beforeInitialize();}
		this.listenTo(this, 'sync'                      , this.modelUpdated);
		this.listenTo(app , this.name + ':model:updated', this.updateModel);
	},

	modelUpdated: function(){
		app.trigger(this.name + ':model:updated', this);
	},

	updateModel: function(otherModel){
		if (otherModel.cid !== this.cid && otherModel.id === this.id){
			this.set(otherModel.attributes, {silent: true});
			this.trigger('updated');
		}
	},
	
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