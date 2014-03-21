App.Views.ServiceRequestFormView = App.Views.BaseView.extend({
	template     : HBS.service_request_form_template,
	formContainer: HBS.appliance_form_container,
	
	className: 'col-lg-12',

	events: {
		'click button#single-appliance': 'singleApplianceForm',
		'click button.appliance-delete': 'deleteAppliance',
		'click button[type=submit]'    : 'createServiceRequest',
	},

	serviceRequestSuccessFlash: function(id){
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

	deleteAppliance: function(e){
		e.preventDefault();
		var self = this;
		var index = e.currentTarget.dataset.index;
		var appliances = this.model.appliances;
		var appliance = appliances.at(index);
		appliances.trigger('appliance:deleted');
		appliances.remove(appliance);
		this.$('#appliance-views').empty();
		_.each(appliances.models, function(model){
			self.appendApplianceForm({
				model      : model,
				firstRender: false,
			});
		});
	},

	singleApplianceForm: function(e){
		e.preventDefault();
		var appliances = this.model.appliances;
		var model = new App.Models.Appliance({
			client_name: this.model.get('client_name'),
			client_id  : this.model.get('client_id'),
		});
		appliances.add(model);
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
	},

	createServiceRequest: function(e){
		e.preventDefault();
		var self = this;
		var grandpa = this.parent.parent;
		if (this.model.appliances.length === 0 && App.defined(grandpa)){
			grandpa.flash = this.zeroAppliancesFlash;
			grandpa.displayFlash();
		}
		this.saveModel();
		_.each(this.children, function(child){
			child.saveModel();
		});
		this.model.save(this.model.serialize(), {
			success: function(model, response, options){
				app.trigger('service_request:create:success', model);
				if(App.defined(app.serviceRequests)){
					app.serviceRequests.add(model);
				}
				if(App.defined(app.appliances)){
					app.appliances.add(model.appliances.models);
				}
				app.Renderer.show({
					viewName         : 'ServiceRequestShowView',
					viewModel        : model,
					portletFrameClass: 'green',
					flash            : self.serviceRequestSuccessFlash(model.id)
				});
				grandpa.dispose();
			},
		});
	},

	saveModel: function(){
		this.model.set('client_id', this.$('[name=client_id]').val());
		this.model.set('client_name', this.$('[name=client_name]').val());
		this.model.set('invoiceNumber', this.$('[name=invoiceNumber]').val());
	}
});