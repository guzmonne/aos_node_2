App.Views.ModelFormView = App.Views.BaseView.extend({
	template: HBS.model_form_template,

	events: {
		'submit form': 'createModel',
	},

	createModel: function(e){
		var self = this;
		e.preventDefault();
		this.saveModel();
		this.model.save({}, {
			success: function(){
				self.displayPortletMessage({
					viewCid: self.parent.cid,
					title  : 'Modelo Creado',
					message: 'El nuevo modelo se ha creado con exito.',
					class  : 'success',
				});
			},
		});
		this.model.dispose();
		this.model = new App.Models.Model();
		this.cleanForm();
	},

	saveModel: function(){
		this.model.set('brand', this.$('[name=brand]').val());
		this.model.set('model', this.$('[name=model]').val());
		this.model.set('category', this.$('[name=category]').val());
		this.model.set('subcategory', this.$('[name=subcategory]').val());
	},

	cleanForm: function(){
		this.$('[name=brand]').val('');
		this.$('[name=model]').val('');
		this.$('[name=category]').val('');
		this.$('[name=subcategory]').val('');
	}
});