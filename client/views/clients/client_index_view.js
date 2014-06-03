App.Views.ClientIndexView = App.Views.TableView.extend({
	template : HBS.client_index_template,
	className: "row",
	name     : "Clientes",
	
	tableEl        : '#clients-table',

	awake: function(){
		var self = this;
		fetchOptions = {
			data: {
				fields: '-service_requests'
			}
		};
		this.dataTableOptions = {
			"columnDefs": [
				{ "searchable": false, "targets": -1 },
				{ "className": "center-vh", "targets": -1 },
			],
			"columns": [
				{"data": function(source, type, val){
						if(type === "display"){
							return	'<ul class="list-unstyled">' +
												'<li><strong style="font-size: 16px">'+source.name+'</strong></li>' +
												'<li><strong>'+source["doc-type"]+'</strong> <i class="fa fa-barcode fa-fw"></i>'+source["doc-number"]+'</li>' +
												'<li><i class="fa fa-envelope fa-fw"></i>'+source.email+'</li>' +
											'</ul>';
						}
						return [source.name, source["doc-type"], source["doc-number"], source.email].join(" ");
					}
				},
				{"data": function(source, type, val){
						var phones = source.phones;
						if (!_.isArray(phones)){return phones;}
						if (type === "display"){
							var html = '<ul class="list-unstyled">';
							for (var i = 0; i < phones.length; i++){
								html = html + '<li><i class="fa fa-phone fa-muted fa-fw"></i>'+phones[i].number+'</li>';
							}
							html = html + '</ul>';
							return html;
						}
						return phones.join(' ');
					} 
				},
				{"data": function(source, type, val){
						var addresses = source.addresses;
						if (!_.isArray(addresses)){return addresses;}
						if (type === "display"){
							var html = '';
							for (var i = 0; i < addresses.length; i++){
								html = html + '<address><strong>'+addresses[i].street+'</strong>,<br>'+addresses[i].city+','+addresses[i].department+'</address>';
							}
							return html;
						}
						return addresses.join(' ');
					} 
				},
				{"data": function(source, type, val){
						if(type === "display"){
							var html;
							if (self.selection === true){
								html =	'<a data-id="'+source._id+'" class="btn btn-warning" name="select" data-toggle="tooltip" data-placement="top" title="Seleccionar">' +
													'<i class="fa fa-external-link fa-lg"></i>'+
												'</a>';
							} else {
								html =	'<a href="#render/client/show/'+ source._id +'" class="btn btn-green"  id="client-details" data-toggle="tooltip" data-placement="top" title="Mas Información">' +
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