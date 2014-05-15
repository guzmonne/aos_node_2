App.Views.ServiceRequestShowView = App.Views.TabView.extend({
	name     : function(){
		if (this.model){
			return 'Orden de Servicio #' + this.model.get('id');
		}
	},

	modelId  : null,
	modelName: 'service_request',

	tabs: [
		{
			id    : 'details',
			title : 'Detalle',
			view  : 'ServiceRequestDetailsView',
			active: true,
		},
		{
			id            : 'appliances',
			title         : 'Equipos',
			renderFunction: function(){
				this.renderAppliancesCarousel();
			},
		}
	],

	bindEvents: function(){
		// Interacts with Row View to activate it
		this.listenTo(app, this.modelName + ':row:rendered', this.announceEntrance);
	},

	renderAppliancesCarousel: function(){
		if (!this.appliancesCarousel){
			if (!this.model){return;}
			var self = this;
			this.appliancesCarousel = new App.Views.ApplianceCarouselView({
				synced: true,
				collection : app.storage.getSubCollection('appliances', {
					service_request_id: this.model.id
				}, {
					success: function(){
						self.appliancesCarousel.attachTo(
							self.$('#' + self.modelName + '-appliances-' + self.timestamp), 
							{
								method: 'html',
							}
						);
					}
				})
			});
		}
	},
});