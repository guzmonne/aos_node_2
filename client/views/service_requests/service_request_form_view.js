App.Views.ServiceRequestFormView = App.Views.BaseView.extend({
	template     : HBS.service_request_form_template,
	formContainer: HBS.appliance_form_container,
	
	className: 'col-lg-12',

	events: {
		'click button#single-appliance': 'singleApplianceForm',
		'click button.appliance-delete': 'deleteAppliance',
	},

	deleteAppliance: function(e){
		e.preventDefault();
		var self = this;
		var index = e.currentTarget.dataset.index;
		var appliances = this.model.get('appliances');
		var appliance = appliances.at(index);
		appliances.trigger('appliance:deleted');
		appliances.remove(appliance);
		this.$('#appliance-views').empty();
		_.each(appliances.models, function(model){
			self.appendApplianceForm(model);
		});
	},

	singleApplianceForm: function(e){
		e.preventDefault();
		var appliances = this.model.get('appliances');
		var model = new App.Models.Appliance({
			client_name: this.model.get('client_name'),
			client_id  : this.model.get('client_id'),
		});
		appliances.add(model);
		this.appendApplianceForm(model);
	},

	appendApplianceForm: function(model){
		var appliances = this.model.get('appliances');
		var view       = new App.Views.ApplianceSingleFormView({model: model});
		var index      = appliances.indexOf(model);
		var style      = '';
		if ((index % 2) === 1){style = 'background-color: #E6E6E6';}
		this.$('#appliance-views').append(this.formContainer({
			index: index,
			style: style
		}));
		view.attachTo(this.$('#appliance-container-'+index), {method: 'append'});
	},
});