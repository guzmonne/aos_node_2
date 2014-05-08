App.Views.ServiceRequestFormView = App.Views.BaseView.extend({
	template     : HBS.service_request_form_template,
	formContainer: HBS.appliance_form_container,
	
	className: 'col-lg-12',

	events: {
		'click button#single-appliance': 'singleApplianceForm',
		'click button.appliance-delete': 'deleteAppliance',
		'click button[type=submit]'    : 'createServiceRequest',
		'click button#select-client'   : 'selectClient',
	},
	
	afterRequest: function(){
		this.$el.tooltip();
	},

	serviceRequestSuccessFlash: function(){
		return {
			title   : 'Orden de Servicio Creada',
			message : 'La Orden de Servicio se ha creado con exito!.',
			class   : 'success',
			method  : 'html',
		};
	},

	zeroAppliancesFlash: {
		title  : 'Atención',
		message: 'Debe agregar por lo menos un equipo a la Orden de Servicio.',
		class  : 'warning',
		method : 'html' 
	},

	selectClient: function(){
		if(!this.clientSelectModalView){
			this.clientSelectModalView = new App.Views.ClientSelectModalView();
		}
		app.modalController.displayModal(this.clientSelectModalView, this, 'clientSelected');
	},

	clientSelected: function(model){
		this.model.set('client_id', model.get('_id'));
		this.model.set('client_name', model.get('name'));
		this.render();
	},

	deleteAppliance: function(e){
		e.preventDefault();
		var self       = this;
		var index      = e.currentTarget.dataset.index;
		var appliances = this.model.appliances;
		var appliance  = appliances.at(index);
		appliances.trigger('appliance:deleted');
		appliances.remove(appliance);
		this.$('#appliance-views').empty();
		_.each(appliances.models, function(model){
			self.appendApplianceForm({
				model      : model,
				firstRender: false,
			});
		});
		if(appliances.length === 0){this.$('button[type=submit]').attr('disabled', true);}
	},

	singleApplianceForm: function(e){
		e.preventDefault();
		if (!this.model.appliances){
			this.model.createChilds();
		}
		var model = new App.Models.Appliance({
			client_name: this.model.get('client_name'),
			client_id  : this.model.get('client_id'),
		});
		this.$('button[type=submit]').attr('disabled', false);
		this.model.appliances.add(model);
		this.appendApplianceForm({model: model});
	},

	appendApplianceForm: function(options){
		if(!App.defined(options.model)){return new Error('No model was passed in the options.');}
		var appliances = this.model.appliances;
		var view       = new App.Views.ApplianceSingleFormView(options);
		var index      = appliances.indexOf(options.model);
		var style      = '';
		if ((index % 2) === 1){style = 'background-color: #E6E6E6';}
		this.$('#appliance-views').append(this.formContainer({
			index: index,
			style: style
		}));
		view.attachTo(this.$('#appliance-container-'+index), {method: 'append'});
		if(index === (appliances.length - 1)){
			App.scrollTo(view.$el);
		}
	},

	createServiceRequest: function(e){
		e.preventDefault();
		var self = this;
		if (this.model.appliances.length === 0){
			return this.invoke('showMessage', this.zeroAppliancesFlash);
		}
		this.saveModel();
		_.each(this.children, function(child){
			child.saveModel();
		});
		this.model.save(this.model.serialize(), {
			success: function(model, response, options){
				app.Renderer.show({
					viewName         : 'ServiceRequestShowView',
					model            : model,
					portletFrameClass: 'green',
					flash            : self.serviceRequestSuccessFlash()
				});
				self.invoke('closePortletView');
			},
		});
	},

	saveModel: function(){
		this.model.set('client_id'    , this.$('[name=client_id]').val());
		this.model.set('client_name'  , this.$('[name=client_name]').val());
		this.model.set('invoiceNumber', this.$('[name=invoiceNumber]').val());
	},
});