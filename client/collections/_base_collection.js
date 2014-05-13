App.Collections.BaseCollection = Giraffe.Collection.extend({
	modelName  : '',
	modelFilter: {},

	url: function(){
		return '/api/' + this.modelName;
	},

	awake: function(){},

	initialize: function(options){
		this.awake.apply(this, arguments);
		//this.listenTo(app, 'active', function(){console.log(this.modelName, this.length);});
		//this.listenTo(app, this.modelName + ':model:created', this.checkModel);
	},

	checkModel: function(attrs){
		// if there already exists a model with the passed id then return
		if (this.where({id: attrs._id}).length > 1){return;}
		var matches = _.matches(this.modelFilter);
		if (this.modelFilter === null || matches(attrs)){
			this.add(new this.model(attrs));
		} 
	},

	//setParent: function(parent){
	//	this.parent = parent;
	//	this.listenTo(parent, 'disposed', this.dispose);
  //},
});