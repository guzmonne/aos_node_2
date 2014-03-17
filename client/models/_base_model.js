App.Models.BaseModel = Giraffe.Model.extend({
	idAttribute: '_id',
	
	dateDDMMYYYY: function(date){
		return date.getDate() +
			"/" + date.getMonth() + 
			"/" + date.getFullYear();
	},
});