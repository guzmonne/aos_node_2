App.Models.Model = App.Models.BaseModel.extend({
	
	url: function(){
		var u = '/api/models';
		if (this.id){
			u = u + '/' + this.id;
		}
		return u;
	},

	defaults: function(){
		return {
			'createdBy'  : 'Guzmán Monné',
			'updatedBy'  : 'Guzmán Monné'
		};
	},
});