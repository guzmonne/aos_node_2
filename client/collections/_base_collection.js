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
});