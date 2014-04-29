App.Views.ApplianceShowView = App.Views.BaseView.extend({
	template: HBS.appliance_show_template,
	className: 'row',
	modelName: 'appliance',

	name: function(){
		return 'Equipo: #' + this.model.get('id');
	},
	
	initialize: function(){
		if (App.defined(this.model)){
			this.listenToOnce(this.model, 'change', this.update);
		}
		this.listenTo(app, this.modelName + ':row:rendered', this.announce);
	},

	afterRender: function(){
		this.formView = new App.Views.ApplianceEditFormView({
			model: this.model,
		});
		this.formView.attachTo(this.$('#form-' + this.cid), {method: 'html'});
		this.announce();
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