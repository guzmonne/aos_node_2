App.Views.ServiceRequestShowView = App.Views.TabView.extend({
	events: {
		'click a': 'tryToslideToAppliance',
	},

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

	tryToslideToAppliance: function(e){
		var id, el = this.$(e.target).closest('a'); 
		if (el.attr('id') !== "appliance-details"){ return; }
		if (e) {e.preventDefault();}
		id = el.data('id');
		if (!this.appliancesCarousel){ return this.renderAppliancesCarousel(id); }
		this.slideToAppliance(id);
	},

	slideToAppliance: function(id){
		if (!this.appliancesCarousel){ return this.renderAppliancesCarousel(id); }
		var index =  this.getApplianceIndex(id);
		if (index === -1) { return; }
		this.$('#service_request-tabs li:eq(1) a').tab('show');
		this.appliancesCarousel.slideTo(index + 1);
	},

	getApplianceIndex: function(id){
		var index, model, view, collection;
		if (!this.appliancesCarousel){return -1;}
		view       = this.appliancesCarousel;
		collection = view.collection;
		model      = collection.get(id);
		if (!model){return -1;}
		index = collection.indexOf(model);
		return index;
	},

	bindEvents: function(){
		// Interacts with Row View to activate it
		this.listenTo(app, this.modelName + ':row:rendered', this.announceEntrance);
		this.listenTo(this.model, 'sync', function(){this.invoke('setHeader');});
	},

	renderAppliancesCarousel: function(id){
		if (!this.appliancesCarousel){
			if (!this.model){return;}
			var self = this;
			var el   = this.$('#' + this.modelName + '-appliances-' + this.timestamp);
			this.appliancesCarousel = new App.Views.ApplianceCarouselView({
				synced: true,
				collection : app.storage.getSubCollection('appliances', {
					service_request_id: this.model.id
				}, {
					success: function(){
						self.appliancesCarousel.attachTo(el, {method: 'html'});
						if (id) { self.slideToAppliance(id); }
					}
				})
			});
		}
	},
});