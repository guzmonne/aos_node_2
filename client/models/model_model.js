App.Models.Model = App.Models.BaseModel.extend({
	
	url: function(){
		var u = '/api/models';
		if (this.id){
			u = u + '/' + id;
		}
		return u;
	},

	defaults: function(){
		return {
			'model'      : null,
			'brand'      : null,
			'category'   : null,
			'subcategory': null,
			'createdBy'  : 'Guzmán Monné',
			'updatedBy'  : 'Guzmán Monné'
		};
	},
});