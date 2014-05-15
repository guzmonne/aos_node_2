App.Views.ServiceRequestRowView = App.Views.RowView.extend({
	template : HBS.service_request_row_template,
	modelName: "service_request",
	
	serialize: function(){
		var object = {};
		if (App.defined(this.model)){
			object = this.model.serialize();
			var createdAt = this.model.get('createdAt');
			if (App.defined(createdAt)){
				object.createdAt = this.model.dateDDMMYYYY(createdAt);
			}
		}
		return object;
	},
});