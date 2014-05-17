App.Views.TechIndexView = App.Views.TableView.extend({
	template : HBS.tech_index_template,
	className: "row",
	name     : "Tecnicos",
	
	tableEl        : '#techs-table',
	modelView      : App.Views.UserRowView,

	fetchOptions: {
		data: {
			techs: true,
		}
	}
});