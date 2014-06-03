App.Views.TechIndexView = App.Views.TableView.extend({
	template : HBS.tech_index_template,
	className: "row",
	name     : "Tecnicos",
	
	tableEl        : '#techs-table',
	modelView      : App.Views.UserRowView,

	awake: function(){
		this.fetchOptions = {
			data: {
				techs: true,
			}
		};		
		this.dataTableOptions = {
			"columnDefs": [
				{ "searchable": false, "targets": -1 },
				{ "className": "center-vh", "targets": -1 },
			],
			"columns": [
				{"data": function(source, type, val){
						if(type === "sort"){return source.name;}
						if(type === "display"){
							var html = '<dd><i class="fa fa-user fa-fw"></i>'+source.name+'</dd>';
							if (source.email){html = html + '<dd><i class="fa fa-envelope fa-fw"></i>'+source.email+'</dd>';}
							return html;
						}
						return [source.name, source.email].join(' ');
					} 
				},
				{"data": function(source, type, val){
						if(type === "display"){
							var html = '<dt>Roles</dt>';
							if (source.permissions.roles.isAdmin === true){html = html + '<dd>Administrador</dd>';}
							if (source.permissions.roles.isTech  === true){html = html + '<dd>Tecnico</dd>';}
							return html;
						}
						var result = [];
						if (source.permissions.roles.isAdmin === true){result.push('Administrador');}
						if (source.permissions.roles.isTech  === true){result.push('Tecnico');}
						return result.join(' ');
					} 
				},
				{"data": function(source, type, val){
						if(type === "display"){
							return '<a href="#render/user/show/'+ source._id +'" class="btn btn-green"  id="user-details" data-toggle="tooltip" data-placement="top" title="Mas Información">' +
								'<i class="fa fa-ellipsis-h fa-fw"></i>' +
							'</a>';
						}
						return source._id;
					}
				}
			]
		};
	},
});