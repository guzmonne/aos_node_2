App.Views.ServiceRequestFormView = App.Views.BaseView.extend({
	template     : HBS.service_request_form_template,
	formContainer: HBS.appliance_form_container,
	
	className: 'col-lg-12',

	events: {
		'click button#single-appliance'   : 'newSingleApplianceForm',
		'click button#multiple-appliances': 'newMultipleAppliancesForm',
		'click button.appliance-delete'   : 'deleteAppliance',
		'click button[type=submit]'       : 'createServiceRequest',
		'click button#select-client'      : 'selectClient',
	},

	initialize: function(){
		this.listenTo(this.model, 'change:client_name'  , function(){this.updateViewField.apply(this, ['client_name']);});
		this.listenTo(this.model, 'change:invoiceNumber', function(){this.updateViewField.apply(this, ['invoiceNumber']);});
		this.model.appliances = new App.Collections.Appliances();
		this.listenTo(this.model.appliances, 'change', this.setAppliances);
		this.listenTo(this.model.appliances, 'remove', this.setAppliances);
		this.listenTo(this, 'disposing', function(){
			this.model.appliances.dispose();
			this.model.appliances = undefined;
		});
	},

	setAppliances: function(){
		this.model.set('appliances', this.model.appliances.toJSON());
	},
	
	afterRender: function(){
		this.$el.tooltip();
		if (this.model && this.model.get('client_name') && this.model.get('client_id')){
			this.$('.btn-success').attr('disabled', false);
		}
	},

	serviceRequestSuccessFlash: {
		title   : 'Orden de Servicio Creada',
		message : 'La Orden de Servicio se ha creado con exito!.',
		class   : 'success',
	},

	zeroAppliancesFlash: {
		title  : 'Atención',
		message: 'Debe agregar por lo menos un equipo a la Orden de Servicio.',
		class  : 'warning',
	},

	selectClient: function(){
		if(!this.clientSelectModalView){
			this.clientSelectModalView = new App.Views.ClientSelectModalView();
		}
		app.modalController.displayModal(this.clientSelectModalView, this, 'clientSelected');
	},

	clientSelected: function(model){
		this.model.set('client_id'  , model.get('_id'));
		this.model.set('client_name', model.get('name'));
		this.$('.btn-success').attr('disabled', false);
	},

	newMultipleAppliancesForm: function(e){
		e.preventDefault();
		this.$('#multiple-appliances').hide();
		this.$('#single-appliance').hide();
		this.$('button[type=submit]').attr('disabled', false);
		this.appendMultipleAppliancesForm();
	},

	appendMultipleAppliancesForm: function(){
		this.multipleAppliancesForm = new App.Views.ApplianceMultipleFormView({
			collection: this.model.appliances,
		});
		this.multipleAppliancesForm.attachTo(this.$('#appliance-views'), {method: 'html'});
		App.scrollTo(this.multipleAppliancesForm.$el);
	},

	newSingleApplianceForm: function(e){
		e.preventDefault();
		this.$('#multiple-appliances').hide();
		var model = app.storage.newModel("appliances");
		model.set({
			client_name: this.model.get('client_name'),
			client_id  : this.model.get('client_id')
		});
		this.$('button[type=submit]').attr('disabled', false);
		this.model.appliances.add(model);
		this.appendApplianceForm(model);
	},

	appendApplianceForm: function(model, view){
		var appliances = this.model.appliances;
		if (model && !view){
			view = new App.Views.ApplianceSingleFormView({ model : model });
			view.listenTo(view.model, 'remove', function(){ view.dispose(); });
			this.addChild(view);
		} else if (!model && view) {
			model = view.model;
		}
		var index = appliances.indexOf(model);
		var style = (index % 2) ? 'background-color: #fff' : 'background-color: #E6E6E6';
		this.$('#appliance-views').append(this.formContainer({
			index: index,
			style: style
		}));
		view.attachTo(this.$('#appliance-container-'+index), {method: 'append'});
		if(index === (appliances.length - 1)){ App.scrollTo(view.$el, 50); }
	},

	deleteAppliance: function(e){
		e.preventDefault();
		var self       = this;
		var index      = e.currentTarget.dataset.index;
		var appliance  = this.model.appliances.at(index);
		appliance.dispose();
		this.$('#appliance-views').empty();
		_.each(this.children, function(view){
			self.appendApplianceForm(null, view);
			view.tagsinput();
		});
		if(this.model.appliances.length === 0){
			App.scrollTo(this.$el);
			this.$('#multiple-appliances').show();
			this.$('button[type=submit]').attr('disabled', true);
		}
	},

	createServiceRequest: function(e){
		e.preventDefault();
		var self = this;
		this.saveModel();
		_.each(this.children, function(child){
			child.saveModel();
		});
		if (this.model.appliances.length === 0){
			return this.invoke('showMessage', this.zeroAppliancesFlash);
		}
		this.model.save(null, {
			success: function(model, response, options){
				var route = 'service_request/show/' + model.id;
				Backbone.history.navigate(route);
				self.stopListening(model.appliances);
				app.Renderer.show({
					viewName         : 'ServiceRequestShowView',
					viewType         : 'show',
					model            : model,
					fetch            : false,
					portletFrameClass: 'green',
					flash            : self.serviceRequestSuccessFlash,
				});
				self.invoke('closePortletView');
			},
		});
	},

	saveModel: function(){
		this.model.set(_.pick(this.$('form').formParams(),
			'client_id',
			'client_name',
			'invoiceNumber'
		));
	},
});