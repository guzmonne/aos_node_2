App.Views.ApplianceRowView = App.Views.RowView.extend({
	template: HBS.appliance_row_template,
	modelName: 'appliance',

	beforeRender: function(){
		if (_.isString(this.model.get('model_id'))){
			this.model.set('model_id', this.invoke('requestModel'));
		}
	},

	serialize: function(){
		var object = {};
		if (App.defined(this.model)){
			var createdAt    = this.model.get('createdAt');
			var updatedAt    = this.model.get('updatedAt');
			var closedAt     = this.model.get('closedAt');
			object           = this.model.toJSON();
			_.extend(object, this.model.get('model_id'));
			object.createdAt =	(App.defined(createdAt))	?	this.model.dateDDMMYYYY(createdAt)	:	null;
			object.updatedAt =	(App.defined(updatedAt))	? this.model.dateDDMMYYYY(updatedAt)	: null;
			object.closedAt  =	(App.defined(closedAt))		? this.model.dateDDMMYYYY(closedAt)		: null;
		}
		return object;
	},
});