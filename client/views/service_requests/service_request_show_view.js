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
			if (!App.defined(this.model) || 
				!App.defined(this.model.appliances)
			){
				return;
			}
			this.appliancesCarousel = new App.Views.ApplianceCarouselView({
				collection : this.model.appliances,
			});
			this.appliancesCarousel.attachTo(
				this.$('#' + this.modelName + '-appliances-' + this.timestamp), 
				{
					method: 'html',
				}
			);
		}
	},
});