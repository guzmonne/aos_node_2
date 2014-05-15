App.Views.UserFormView = App.Views.BaseView.extend({
	template: HBS.user_form_template,

	events: {
		'click .checkbox label': 'toggleCheckBox',
		'submit form'          : 'createModel',
	},

	initialize: function(){
		this.bindEvents();
	},

	bindEvents: function(){
		this.listenTo(this.model, 'change:name' , function(){this.updateViewField.apply(this, ['name']);});
		this.listenTo(this.model, 'change:email', function(){this.updateViewField.apply(this, ['email']);});
		this.listenTo(this.model, 'change:admin', function(){this.updateViewField.apply(this, ['admin']);});
		this.listenTo(this.model, 'change:tech' , function(){this.updateViewField.apply(this, ['tech']);});
	},

	createModel: function(e){
		var self = this;
		e.preventDefault();
		this.saveModel();
		this.model.save({}, {
			success: function(){
				self.invoke('showMessage', {
					title  : 'Usuario Creado',
					message: 'El nuevo Usuario se ha creado con exito.',
					class  : 'success',
				});
			},
		});
		this.model = app.storage.newModel("users");
		this.bindEvents();
		this.cleanForm();
	},

	saveModel: function(){
		var attrs = _.pick(this.$('form').formParams(), 'name', 'email');
		attrs.permissions = this.getPermissions();
		this.model.set(attrs);
	},

	cleanForm: function(){
		this.$('[name=name]').val('').focus();
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

	toggleCheckBox: function(e){
		var name     = e.target.htmlFor;
		var checkbox = this.$('[name='+name+']');
		checkbox.prop("checked", !checkbox.prop('checked'));
	},
});