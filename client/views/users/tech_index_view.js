App.Views.TechIndexView = App.Views.TableView.extend({
	template : HBS.tech_index_template,
	className: "row",
	name     : "Tecnicos",
	
	tableEl        : '#techs-table',
	modelView      : App.Views.UserRowView,

	awake: function(){
		this.fetchOptions = { data: { techs: true } };
		_.extend(this, App.Mixins.UserIndex);
		_.bindAll(this, 'userShowButton', 'userRoles', 'userData');		
	},
});