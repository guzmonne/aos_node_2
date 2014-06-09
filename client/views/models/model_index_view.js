App.Views.ModelIndexView = App.Views.TableView.extend({
	template : HBS.model_index_template,
	className: "row",
	name     : "Modelos",
	
	tableEl        : '#models-table',

	awake: function(){
		var self = this;
		this.fetchOptions = {
			data: {
				fields: 'brand model category subcategory _id'
			}
		};
		this.dataTableOptions = {
			"columnDefs": [
				{ "searchable": false, "targets": -1 },
				{ "className": "center-vh", "targets": -1 },
			],
			"columns": [
				{"data": "model"},
				{"data": "brand"},
				{"data": "category"},
				{"data": "subcategory"},
				{"data": function(source, type, val){
						if(type === "display"){
							var html;
							if (self.selection === true){
								html =	'<a data-id="'+source._id+'" class="btn btn-warning btn-xs" name="select" data-toggle="tooltip" data-placement="top" title="Seleccionar">' +
													'<i class="fa fa-external-link fa-lg"></i>'+
												'</a>';
							} else {
								html =	'<a href="#render/model/show/'+ source._id +'" class="btn btn-green btn-xs"  id="client-details" data-toggle="tooltip" data-placement="top" title="Mas Información">' +
													'<i class="fa fa-ellipsis-h fa-fw"></i>' +
												'</a>';
							}
							return html;
						}
						return source._id;
					}
				}
			]
		};
	},
});