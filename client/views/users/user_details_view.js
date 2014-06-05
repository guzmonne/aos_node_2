App.Views.UserDetailsView = App.Views.ShowView.extend({
	template: HBS.user_details_template,
	className: 'row',

	bindings: {
		'[name=name]': 'name',
		'[name=email]': 'email',
		'[name=permissions]': {
			observe: 'permissions',
			onGet: function(permissions){
				if (!permissions.roles || !_.isObject(permissions.roles) || _.keys(permissions.roles) === 0){return "";}
				var html = '';
				if (permissions.roles.isAdmin === true){html = html + '<li>Administrador</li>';}
				if (permissions.roles.isTech === true) {html = html + '<li>Tecnico</li>';}
				return html;
			},
			updateMethod: 'html'
		},
		'[name=createdAt]': {
			observe: 'createdAt',
			onGet: function(value){
				return App.dateDDMMYYYY(value);
			},
		},
		'[name=createdBy]': 'createdBy',
		'[name=updatedAt]': {
			observe: 'updatedAt',
			onGet: function(value){
				return App.dateDDMMYYYY(value);
			},
		},
		'[name=updatedBy]': 'updatedBy',
	},

	awake: function(){
		this.listenTo(this.model, 'change:name'  , this.invokeSetHeader);
		this.listenTo(this      , 'disposing'    , function(){this.unstickit();});
	},

	afterRender: function(){
		this.stickit();
	},

	serialize: function(){
		var result = (App.defined(this.model)) ? this.model.toJSON() : {};
		result.timestamp = this.timestamp;
		return result;
	},
});