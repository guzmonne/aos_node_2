App.Views.ClientShowView = App.Views.BaseView.extend({
	template: HBS.client_show_template,
	form    : HBS.client_form_template,

	name    : null,
	modelId : null,

	appEvents: {
		"client:row:rendered": 'announce',
	},

	events:{
		'click #client-edit'            : 'renderForm',
		'click #client-service-requests': 'renderServiceRequests',
	},

	initialize: function(){
		if(App.defined(this.model)){
			this.bindEvents();
		} else {
			this.model = new App.Models.Client();
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
			});
		}	else {
			if (App.defined(this.renderChilds) && _.isFunction(this.renderChilds)){
				this.renderChilds();
			}
			this.announce();
			this.setName();
			this.parent.setHeader();
			App.scrollTo(this.parent.el);

		}
	},

	renderChilds: function(){
		this.renderDetails();
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
		var result = (App.defined(this.model)) ? this.model.serialize() : {};
		result.timestamp = this.timestamp;
		return result;
	},

	renderForm: function(){
		if (!App.defined(this.clientForm)){
			var id = this.timestamp;
			this.clientForm = new App.Views.ClientFormView({model: this.model});
			this.clientForm.attachTo(this.$('#client-form-'+id), {method: 'html'});
		}
	},

	renderDetails: function(){
		if (!App.defined(this.clientDetails)){
			var id = this.timestamp;
			this.clientDetails = new App.Views.ClientDetailsView({model: this.model});
			this.clientDetails.attachTo(this.$('#client-details-'+id), {method: 'html'});
		}
	},

	renderServiceRequests: function(){
		if (!App.defined(this.serviceRequests)){
			var id = this.timestamp;
			this.serviceRequests = new App.Views.ServiceRequestIndexView({
				collection: new App.Collections.ServiceRequests()
			});
			this.serviceRequests.collection.client_id = this.model.id;
			this.serviceRequests.attachTo(this.$('#client-service_requests-'+id), {method: 'html'});
		}
	},

	announce: function(){
		app.trigger('client:show:active', this.model.id);
	},

	beforeDispose: function(){
		app.trigger('client:show:close', this.model.id);
	},
});