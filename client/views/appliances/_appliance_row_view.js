App.Views.ApplianceRowView = App.Views.RowView.extend({
	template: HBS.appliance_row_template,
	modelName: 'appliance',

	serialize: function(){
		var object = {};
		if (App.defined(this.model)){
			object        = this.model.toJSON();
			var createdAt = this.model.get('createdAt');
			var updatedAt = this.model.get('updatedAt');
			var closedAt  = this.model.get('closedAt');
			if (object.client_id){
				object.client_name = app.storage.collection("clients").get(object.client_id).get('name');
			}
			if (object.technician_id){
				object.technician_name = app.storage.collection("techs").get(object.technician_id).get('name');
			}
			if(object.model_id){
				_.extend(object, app.storage.collection("models").get(object.model_id).pick('brand', 'category', 'subcategory', 'model'));
			}
			object.createdAt =	(App.defined(createdAt))	?	this.model.dateDDMMYYYY(createdAt)	:	null;
			object.updatedAt =	(App.defined(updatedAt))	? this.model.dateDDMMYYYY(updatedAt)	: null;
			object.closedAt  =	(App.defined(closedAt))		? this.model.dateDDMMYYYY(closedAt)		: null;
		}
		return object;
	},
});