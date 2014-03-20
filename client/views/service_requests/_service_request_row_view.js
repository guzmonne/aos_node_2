App.Views.ServiceRequestRowView = App.Views.BaseView.extend({
	template: HBS.service_request_row_template,

	tagName  : 'tr',

	initialize: function(){
		this.listenTo(this.model, 'change', this.render);
	},

	serialize: function(){
		var object = {};
		if (App.defined(this.model)){
			object = this.model.toJSON();
			var appliances = this.model.appliances;
			var createdAt = this.model.get('createdAt');
			if (App.defined(appliances)){
				object.appliances_length = appliances.length;	
			}
			if (App.defined(createdAt)){
				object.createdAt = this.model.dateDDMMYYYY(createdAt);
			}
		}
		return object;
	},
});