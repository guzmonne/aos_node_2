App.Views.ServiceRequestShowView = App.Views.BaseView.extend({
	template: HBS.service_request_show_template,

	name: null,

	initialize: function(){
		var self = this;
		if(App.defined(this.model)){
			this.bindEvents();
		} else {
			if (App.defined(this.modelId)){
				this.model = new App.Models.ServiceRequest();
				this.model.set('_id', this.modelId);
				this.model.id = this.modelId;
				this.model.fetch({
					success: function(){
						self.render();
						self.bindEvents();
					},
				});
			}
		}
	},

	bindEvents: function(){

	},

	serialize: function(){
		var result;
		if(!App.defined(this.model)){return {};}
		result = this.model.toJSON();
		if(result.createdAt){
			result.createdAt = this.model.dateDDMMYYYY(result.createdAt);
		}
		if(result.updatedAt){
			result.updatedAt = this.model.dateDDMMYYYY(result.updatedAt);
		}
		return result;
	},

	afterRender: function(){
		App.scrollTo(this.parent.el);
		this.announce();
		this.setName();
		this.parent.setHeader();
	},

	setName: function(){
		this.name = 'Orden de Servicio #' + this.model.get('id');
	},

	announce: function(){
		app.trigger('service_request:show:active', this.model.id);
	},

	beforeDispose: function(){
		app.trigger('service_request:show:close', this.model.id);
	},
});