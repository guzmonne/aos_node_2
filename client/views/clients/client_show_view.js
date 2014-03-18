App.Views.ClientShowView = App.Views.BaseView.extend({
	template: HBS.client_show_template,
	form    : HBS.client_form_template,

	name    : null,
	modelId : null,

	appEvents: {
		"client:row:rendered": 'announce',
	},

	initialize: function(){
		this.update      = _.throttle(this.update, 500);
		this.synchronize = _.throttle(this.synchronize, 500);
		var self = this;
		if(App.defined(this.model)){
			this.bindEvents();
		} else {
			if (App.defined(this.modelId)){
				this.model    = new App.Models.Client();
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

	afterRender: function(){
		App.scrollTo(this.parent.el);
		this.announce();
		this.setName();
		this.parent.setHeader();
		this.renderForm();
		this.renderServiceRequests();
	},

	bindEvents: function(){
		this.listenTo(this.model, 'updated', this.update);
		this.listenTo(this.model, 'change', this.synchronize);
		this.listenTo(this.app, 'sync:client:' + this.model.id, this.update);
		this.synchronize = _.debounce(this.synchronize, 100);
	},

	setName: function(){
		this.name = 'Cliente: ' + this.model.get('name') + ' #' + this.model.id;
	},

	onSync: function(){
		var self = this;
		this.model.fetch({
			success: function(){
				self.afterSync();
				self.update();
			},
		});
	},

	afterSync: function(){
		app.trigger('portlet:view: '+ this.cid +':sync:spin:stop');
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

	serialize: function(){
		var createdAt = this.model.get('createdAt');
		var updatedAt = this.model.get('updatedAt');
		this.model.set('createdAtShort', this.model.dateDDMMYYYY(createdAt), {silent: true});
		this.model.set('updatedAtShort', this.model.dateDDMMYYYY(updatedAt), {silent: true});
		return this.model.serialize();
	},

	renderForm: function(){
		this.clientForm = new App.Views.ClientFormView({model: this.model});
		this.clientForm.attachTo(this.$('#client-form-' + this.model.id), {method: 'html'});
	},

	renderServiceRequests: function(){
		var id = this.model.id;
		this.serviceRequests = new App.Views.ServiceRequestIndexView();
		this.serviceRequests.attachTo(this.$('#client-service_requests-'+id), {method: 'html'});
	},

	announce: function(){
		app.trigger('client:show:active', this.model.id);
	},

	beforeDispose: function(){
		app.trigger('client:show:close', this.model.id);
	},
});