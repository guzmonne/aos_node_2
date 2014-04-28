App.Views.UserIndexView = App.Views.TableView.extend({
	template : HBS.user_index_template,
	className: "row",
	name     : "Usuarios",
	
	tableEl        : '#users-table',
	tableCollection: App.Collections.Users,
	modelView      : App.Views.UserRowView,

	appStorage  : 'users',
});