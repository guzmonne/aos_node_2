App.Views.UserFormView = App.Views.FormView.extend({
	template: HBS.user_form_template,
	storage : 'models',
	focus   : '[name=name]',

	initialize: function(){
		this.bindEvents();
	},

	bindEvents: function(){
		this.listenTo(this.model, 'change:name' , function(){this.updateViewField.apply(this, ['name']);});
		this.listenTo(this.model, 'change:email', function(){this.updateViewField.apply(this, ['email']);});
		this.listenTo(this.model, 'change:permissions', this.updateRoleField);
	},

	afterRender: function(){
		App.Views.FormView.prototype.afterRender.apply(this, arguments);
	},

	updateRoleField: function(role){
		var permissions = this.model.get("permissions");
		this.$('[name=isTech]' ).prop("checked", permissions.roles.isTech);
		this.$('[name=isAdmin]').prop("checked", permissions.roles.isAdmin);
		this.model.trigger("roles:change");
	},

	saveModel: function(){
		var attrs = _.pick(this.$('form').formParams(), 'name', 'email');
		attrs.permissions = this.getPermissions();
		this.model.set(attrs);
	},

	getPermissions: function(){
		return {
			roles: {
				isAdmin: this.$('[name=isAdmin]').is(':checked'),
				isTech : this.$('[name=isTech]').is(':checked'),
			}
		};
	},
});