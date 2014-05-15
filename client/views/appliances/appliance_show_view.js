App.Views.ApplianceShowView = App.Views.ShowView.extend({
	template : HBS.appliance_show_template,
	className: 'row',
	modelName: 'appliance',
	sync     : false,

	name: function(){
		return 'Equipo: #' + this.model.get('id');
	},

	awake: function(){
		this.listenTo(this.model, 'change:client_name', function(){
			this.updateViewText.apply(this, ['client_name']);
			this.invoke('setHeader');
		});
		this.listenTo(this.model, 'change:service_request_id', function(){
			this.$('[name=service_request_id]').attr('href', '#render/service_request/show/' + this.model.get('service_request_id'));
		});
		this.listenTo(this.model, 'change:client_id', function(){
			this.$('[name=client_name]').attr('href', '#render/client/show/' + this.model.get('client_id'));
		});
	},

	afterRender: function(){
		if (!this.formView){
			this.formView = new App.Views.ApplianceEditFormView({
				model: this.model,
			});
			this.formView.attachTo(this.$('#form-' + this.cid), {method: 'html'});
			this.invoke('setHeader');
		}
	},

	serialize: function(){
		var result = this.model.toJSON();
		result.cid = this.cid;
		return result;
	},
});