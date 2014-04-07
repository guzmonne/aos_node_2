App.Views.ServiceRequestShowView = App.Views.TabView.extend({
	name     : null,
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

	setName: function(){
		this.name = 'Orden de Servicio #' + this.model.get('id');
	},
});