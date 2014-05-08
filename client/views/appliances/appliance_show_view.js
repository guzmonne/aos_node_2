App.Views.ApplianceShowView = App.Views.ShowView.extend({
	template : HBS.appliance_show_template,
	className: 'row',
	modelName: 'appliance',
	sync     : false,

	name: function(){
		return 'Equipo: #' + this.model.get('id');
	},

	awake: function(){
		this.listenToOnce(this.model, 'sync', this.render);
		_.once(this.setForm);
	},

	afterRender: function(){
		this.setForm();
	},

	setForm: function(){
		this.formView = new App.Views.ApplianceEditFormView({
			model: this.model,
		});
		this.formView.attachTo(this.$('#form-' + this.cid), {method: 'html'});
		this.invoke('setHeader');
	},

	serialize: function(){
		var result = this.model.toJSON();
		result.cid = this.cid;
		return result;
	},
});