App.Views.ApplianceShowView = App.Views.ShowView.extend({
	template: HBS.appliance_show_template,
	className: 'row',
	modelName: 'appliance',

	name: function(){
		return 'Equipo: #' + this.model.get('id');
	},

	afterRender: function(){
		this.formView = new App.Views.ApplianceEditFormView({
			model: this.model,
		});
		this.formView.attachTo(this.$('#form-' + this.cid), {method: 'html'});
	},

	update: function(){
		this.parent.displayFlash();
		this.parent.setHeader();
		this.render();
	},

	serialize: function(){
		var result = this.model.toJSON();
		result.cid = this.cid;
		return result;
	},
});