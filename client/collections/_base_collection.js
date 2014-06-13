App.Collections.BaseCollection = Giraffe.Collection.extend({
	comparator: 'id',

	initialize: function(){
		this.awake.apply(this, arguments);
	},
});