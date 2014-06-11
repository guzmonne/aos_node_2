App.Mixins.UserIndex = (function(window, undefined){
	var userShowButton = function(source, type, val){
		var model = app.storage.get('users', source._id);
		if(type === "display"){ return model.userShowButton(); }
		return source._id;
	};

	var userRoles = function(source, type, val){
		var model = app.storage.get('users', source._id);
		if(type === "display"){ return model.userRoles(); }
		var result = [];
		if (source.permissions.roles.isAdmin === true){result.push('Administrador');}
		if (source.permissions.roles.isTech  === true){result.push('Tecnico');}
		return result.join(' ');
	};

	var userData = function(source, type, val){
		var model = app.storage.get('users', source._id);
		if(type === "sort")   {return source.name;}
		if(type === "display"){ return model.userDetails(); }
		return [source.name, source.email].join(' ');
	};

	var dataTableOptions = {
		"columnDefs": [
			{ "searchable": false, "targets": -1 },
			{ "className": "center-vh", "targets": -1 },
		],
		"columns": [
			{"data": userData      , "defaultContent": "" },
			{"data": userRoles     , "defaultContent": ""	},
			{"data": userShowButton, "defaultContent": "" }
		]
	};
	
	return {
		dataTableOptions: dataTableOptions,
		userShowButton  : userShowButton,
		userRoles       : userRoles,
		userData        : userData
	};
})();