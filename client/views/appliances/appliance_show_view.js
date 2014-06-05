App.Views.ApplianceShowView = App.Views.ShowView.extend({
	template : HBS.appliance_show_template,
	className: 'row',
	modelName: 'appliance',

	name: function(){
		return 'Equipo: #' + this.model.get('id');
	},

	bindings: {
		'[name=client_id]': {
			observe: 'client_id',
			onGet: function(id){
				try {
					var name = app.storage.get('clients', id).get('name'); 
					return '<a href="#render/client/show/'+id+'">'+name+'</a>';
				} catch (err) {
					return "";
				}
			},
			updateMethod: 'html'
		},
		'[name=service_request_id]': {
			observe: 'service_request_id',
			onGet: function(id){
				return '<a href="#render/service_request/show/'+id+'" class="btn btn-green pull-right" data-toggle="tooltip" data-placement="top" title="Orden de Servicio">' +
									'<i class="fa fa-clipboard fa-fw"></i> Ir a Orden de Servicio' +
								'</a>';
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
		this.listenTo(this.model, 'change:id'  , this.invokeSetHeader);
		this.listenTo(this      , 'disposing'  , function(){this.unstickit();});
	},

	afterRender: function(){
		this.stickit();
		this.renderForm();
	},

	renderForm: function(){
		if (!this.formView){
			this.formView = new App.Views.ApplianceEditFormView({
				model: this.model,
			});
			this.formView.attachTo(this.$('#form-' + this.cid), {method: 'html'});
		}
	},

	serialize: function(){
		var result = this.model.toJSON();
		result.cid = this.cid;
		return result;
	},

	onSync: function(){
		this.sync("model");
		if (this.model.model_id){this.model.model_id.fetch({merge: true});}
	},
});