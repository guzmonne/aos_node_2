App.Views.UserIndexView = App.Views.TableView.extend({
	template : HBS.user_index_template,
	className: "row",
	name     : "Usuarios",
	
	tableEl        : '#users-table',
	
	awake: function(){
		_.extend(this, App.Mixins.UserIndex);
		_.bindAll(this, 'userShowButton', 'userRoles', 'userData');
	},
});