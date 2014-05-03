App.Views.ClientShowView = App.Views.TabView.extend({
	modelId     : null,
	modelName   : 'client',
	fetchOptions: {
		data: {
			fields: '-service_requests',
		}
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

	onSync: function(){
		var self = this;
		this.model.fetch({
			success: function(){
				self.afterSync();
				self.update();
			},
		});
	},

	update: function(){
		this.parent.flash = {
			title  : 'Cliente Actualizado',
			message: 'El cliente se ha actualizado con exito.',
			class  : 'success',
		};
		this.parent.render();
	},

	synchronize: function(){
		this.parent.flash = {
			title   : 'Cliente Desincronizado',
			message : 'Se han realizado cambios en este cliente que no se ven reflejados actualmente. Desea actualizar esta información?',
			htmlMsg : '<p><button type="button" class="btn btn-warning" data-event="sync:client:'+this.model.id+'">Actualizar</button></p>',
			class   : 'warning',
			lifetime: 0,
			method  : 'html',
		};
		this.parent.displayFlash();
	},

	renderServiceRequests: function(){
		if (!App.defined(this.serviceRequests)){
			this.serviceRequests = new App.Views.ServiceRequestIndexView({
				collection: new App.Collections.ServiceRequests()
			});
			this.serviceRequests.collection.client_id = this.model.id;
			this.serviceRequests.attachTo(this.$('#client-service_requests-'+ this.timestamp), {method: 'html'});
		}
	},
});