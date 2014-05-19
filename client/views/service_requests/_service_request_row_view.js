App.Views.ServiceRequestRowView = App.Views.RowView.extend({
	template : HBS.service_request_row_template,
	modelName: "service_request",
	
	serialize: function(){
		var object = {};
		if (App.defined(this.model)){
			object = this.model.serialize();
			var createdAt = this.model.get('createdAt');
			var updatedAt = this.model.get('updatedAt');
			if (createdAt){ object.createdAt = this.model.dateDDMMYYYY(createdAt); }
			if (updatedAt){ object.updatedAt = this.model.dateDDMMYYYY(updatedAt); }
		}
		return object;
	},
});