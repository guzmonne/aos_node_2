App.Views.ServiceRequestDetailsView = App.Views.ShowView.extend({
	template: HBS.service_request_details_template,
	className: 'row',

	awake: function(){
		_.once(this.renderApplianceIndex);
		this.listenTo(this.model, 'change:client_name', function(){this.updateViewText.apply(this, ['client_name']);});
		this.listenTo(this.model, 'change:status', function(){this.updateViewText.apply(this, ['status']);});
		this.listenTo(this.model, 'change:invoiceNumber', function(){
			this.updateViewText.apply(this, ['invoiceNumber']);
			if (this.model.get('invoiceNumber') === ''){ 
				this.$('[name=invoiceText]').addClass("hide"); 
			} else {
				this.$('[name=invoiceText]').removeClass("hide");
			}
		});
		this.listenTo(this.model, 'change:client_id', function(){
			this.$('[name=client_name]').attr('href', '#render/client/show/' + this.model.get('client_id'));
		});
	},

	afterRender: function(){
		this.renderApplianceIndex();
		this.invoke('setHeader');
	},

	renderApplianceIndex: function(){
		if (!App.defined(this.model)){return;}
		var self = this;
		var el = this.$('#service-request-appliances');
		this.appliancesIndex = new App.Views.ApplianceIndexView({
			synced       : true,
			collection   : app.storage.getSubCollection("appliances", {
				service_request_id: this.model.id,
			}, {
				success: function(){
					self.appliancesIndex.attachTo(el, {method: 'html'});
				}
			}),
		});
	},

	serialize: function(){
		var result = (App.defined(this.model)) ? this.model.toJSON() : {};
		result.createdAt = (result.createdAt) ? this.model.dateDDMMYYYY(result.createdAt) : null; 
		result.updatedAt = (result.updatedAt) ? this.model.dateDDMMYYYY(result.updatedAt) : null; 
		result.timestamp = this.timestamp;
		return result;
	},
});