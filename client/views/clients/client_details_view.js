App.Views.ClientDetailsView = App.Views.ShowView.extend({
	template: HBS.client_details_template,

	className: 'row',

	bindings: {
		'[name=name]'      : 'name',
		'[name=doc-type]'  : 'doc-type',
		'[name=doc-number]': 'doc-number',
		'[name=phones]'    : {
			observe: 'phones',
			onGet  : function(values){
				if(!_.isArray(values)){return '<li>Vacío</li>';}
				var html = '';
				for(var i = 0;i < values.length;i++){
					html = html + '<li><i class="fa fa-phone fa-muted fa-fw"></i>'+values[i].number+'</li>';
				}
				return html;
			},
			updateMethod: 'html',
		},
		'[name=addresses]': {
			observe: 'addresses',
			onGet  : function(values){
				if(!_.isArray(values)){return '<li>Vacío</li>';}
				var html = '';
				for(var i = 0;i < values.length;i++){
					html = html + '<li><i class="fa fa-building-o fa-muted fa-fw"></i>'+
													values[i].street+'<br>'+
													values[i].city+','+values[i].city+
												'</li>';
				}
				return html;
			},
			updateMethod: 'html',
		},
		'[name=email]': "email",
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
		this.listenTo(this.model, 'change:name', this.invokeSetHeader);
		this.listenTo(this      , 'disposing'  , function(){this.unstickit();});
	},

	afterRender: function(){
		this.stickit();
	},

	// serialize: function(){
	//	var result       = (App.defined(this.model)) ? this.model.toJSON() : {};
	//	var createdAt    = this.model.get('createdAt');
	//	var updatedAt    = this.model.get('updatedAt');
	//	result.createdAt = this.model.dateDDMMYYYY(createdAt);
	//	result.updatedAt = this.model.dateDDMMYYYY(updatedAt);
	//	return result;
	// },
});