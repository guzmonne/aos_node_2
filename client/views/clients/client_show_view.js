App.Views.ClientShowView = App.Views.TabView.extend({
	modelId     : null,
	modelName   : 'client',
	fetchOptions: {
		data: {
			fields: '-service_requests',
		}
	},
	
	afterRender: function(){
		var self = this;
		this.$('a#client-service_requests[data-toggle=tab]').on('shown.bs.tab', function (e) {
			self.serviceRequests.adjustColumns();
		});
		this.listenTo(this, 'disposing', function(){
			this.$('a#client-service_requests[data-toggle=tab]').off();
		});
		App.Views.TabView.prototype.afterRender.apply(this, arguments);
	},

	name: function(){
		return 'Cliente: ' + this.model.get('name') + ' #' + this.model.get('id');
	},

	tabs: [
		{
			id    : 'details',
			title : 'Detalle',
			view  : 'ClientDetailsView',
			active: true,
		},
		{
			id            : 'service_requests',
			title         : 'Ordenes de Servicio',
			class         : 'air-t',
			renderFunction: function(){
				this.renderServiceRequests();
			},
		},
		{
			id   : 'edit',
			title: 'Editar Datos',
			class: 'air-t row',
			view : 'ClientFormView',
		}
	],

	renderServiceRequests: function(){
		if (!App.defined(this.serviceRequests)){
			var self = this;
			this.serviceRequests = new App.Views.ServiceRequestIndexView({
				collection: app.storage.getSubCollection("service_requests", {
					client_id: this.model.id,
				}, {
					success: function(){
						self.serviceRequests.attachTo(
							self.$('#client-service_requests-'+ self.timestamp), 
							{method: 'html'}
						);
					}
				}),
				synced: true,
			});
		} else {}
	},
});