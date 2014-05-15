App.Collections.BaseCollection = Giraffe.Collection.extend({
	modelName  : '',
	modelFilter: {},

	url: function(){
		return '/api/' + this.modelName;
	},

	awake: function(){},

	initialize: function(options){
		this.awake.apply(this, arguments);
	},

	checkModel: function(attrs){
		// if there already exists a model with the passed id then return
		if (this.where({id: attrs._id}).length > 1){return;}
		var matches = _.matches(this.modelFilter);
		if (this.modelFilter === null || matches(attrs)){
			this.add(new this.model(attrs));
		} 
	},
});