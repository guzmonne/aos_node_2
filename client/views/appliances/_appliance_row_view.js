App.Views.ApplianceRowView = App.Views.RowView.extend({
	template: HBS.appliance_row_template,
	modelName: 'appliance',

	beforeRender: function(){
		if (!this.model.get('model') && this.parent.baseModel){
			this.model.model = this.parent.baseModel;
		}
	},

	serialize: function(){
		var object = {};
		if (App.defined(this.model)){
			object        = this.model.toJSON();
			var createdAt = this.model.get('createdAt');
			var updatedAt = this.model.get('updatedAt');
			var closedAt  = this.model.get('closedAt');
			if (this.model.model_id)  { _.extend(object, this.model.model_id.pick('brand', 'category', 'subcategory', 'model')); }
			if (this.model.technician){ object.technician_name = this.model.technician.get('name'); }
			object.createdAt =	(App.defined(createdAt))	?	this.model.dateDDMMYYYY(createdAt)	:	null;
			object.updatedAt =	(App.defined(updatedAt))	? this.model.dateDDMMYYYY(updatedAt)	: null;
			object.closedAt  =	(App.defined(closedAt))		? this.model.dateDDMMYYYY(closedAt)		: null;
		}
		return object;
	},
});