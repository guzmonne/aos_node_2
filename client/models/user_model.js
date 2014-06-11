App.Models.User = App.Models.BaseModel.extend({
	urlRoot: '/api/users',

	defaults: function(){
		return {
			'createdBy'  : 'Guzmán Monné',
			'updatedBy'  : 'Guzmán Monné',
		};
	},

	userDetails: function(){
		var name  = this.get('name');
		var email = this.get('email');
		var html  = '<dd><i class="fa fa-user fa-fw"></i>'+name+'</dd>';
		if (email){html = html + '<dd><i class="fa fa-envelope fa-fw"></i>'+email+'</dd>';}
		return html;
	},

	userRoles: function(){
		var html = '<dt>Roles</dt>';
		var permissions = this.get('permissions');
		if (permissions.roles.isAdmin === true){html = html + '<dd>Administrador</dd>';}
		if (permissions.roles.isTech  === true){html = html + '<dd>Tecnico</dd>';}
		return html;
	},

	userShowButton: function(){
		var id = this.id;
		return	'<a href="#render/user/show/'+id+'" class="btn btn-xs btn-green"  id="user-details" data-toggle="tooltip" data-placement="top" title="Mas Información">' +
							'<i class="fa fa-ellipsis-h fa-fw"></i>' +
						'</a>';
	},
});