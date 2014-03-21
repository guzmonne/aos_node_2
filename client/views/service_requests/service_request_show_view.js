App.Views.ServiceRequestShowView = App.Views.BaseView.extend({
	template: HBS.service_request_show_template,

	name: null,

	initialize: function(){
		if(App.defined(this.model)){
			this.bindEvents();
		} else {
			if (App.defined(this.modelId)){
				this.model = new App.Models.ServiceRequest();
			}
		}
		this.timestamp = new Date().getTime();
	},

	afterRender: function(){
		var self = this;
		if(this.model.isNew() && App.defined(this.modelId)){
			this.model.set('_id', this.modelId);
			this.model.fetch({
				success: function(){
					self.render();
					self.bindEvents();
				},
				error: function(){
					self.parent.dispose();
				},
			});
		} else {
			if (_.isFunction(this.renderChilds)){
				this.renderChilds();
			}
			this.announce();
			this.setName();
			this.parent.setHeader();
			App.scrollTo(this.parent.el);
		}
	},

	renderChilds: function(){
		this.renderAppliancesIndex();
	},

	renderAppliancesIndex: function(){
		if(
				!App.defined(this.appliancesIndex)	&& 
				App.defined(this.model)							&&
				App.defined(this.model.appliances)
		){
			this.appliancesIndex = new App.Views.ApplianceIndexView({
				collection: this.model.appliances
			});
			this.appliancesIndex.attachTo(this.$('#service-request-appliances'), {
				method: 'html'
			});
		}
	},
	
	bindEvents: function(){},

	serialize: function(){
		var result = (App.defined(this.model)) ? this.model.toJSON() : {};
		result.createdAt = (result.createdAt) ? this.model.dateDDMMYYYY(result.createdAt) : null; 
		result.updatedAt = (result.updatedAt) ? this.model.dateDDMMYYYY(result.updatedAt) : null; 
		result.timestamp = this.timestamp;
		if(result.status){
			var label;
			switch (result.status){
				case "Pendiente":
					label = "label-primary";
					break;
				case "Abierto":
					label = "label-info";
					break;
				case "Atrasaodo":
					label = "label-danger";
					break;
				case "Cerrado":
					label = "label-success";
					break;
				default:
					label = "label-default";
			}
			result.label = label;
		}
		return result;
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