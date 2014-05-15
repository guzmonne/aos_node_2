App.Views.UserFormView = App.Views.BaseView.extend({
	template: HBS.user_form_template,

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
					title  : 'Usuario Creado',
					message: 'El nuevo Usuario se ha creado con exito.',
					class  : 'success',
				});
			},
		});
		this.model.dispose();
		this.model = app.storage.newModel("users");
		this.cleanForm();
	},

	saveModel: function(){
		this.model.set('name', this.$('[name=name]').val());
		this.model.set('email', this.$('[name=email]').val());
		this.model.set('permissions', this.getPermissions());
	},

	cleanForm: function(){
		this.$('[name=name]').val('');
		this.$('[name=email]').val('');
		this.$('[name=admin]').removeAttr('checked');
		this.$('[name=tech]').removeAttr('checked');
	},

	getPermissions: function(){
		return {
			roles: {
				isAdmin: this.$('[name=admin]').is(':checked'),
				isTech : this.$('[name=tech]').is(':checked'),
			}
		};
	},
});