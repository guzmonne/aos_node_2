App.Views.ServiceRequestDetailsView = App.Views.ShowView.extend({
	template: HBS.service_request_details_template,
	className: 'row',

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
		'[name=status]': 'status',
		'[name=invoiceNumber]': {
			observe: 'invoiceNumber',
			onGet  : function(value){
				if (!App.defined(value) || value === ''){return '';}
				return '<h3 class="pull-right">Remito: <span class="text-primary">'+value+'</span></h3>';
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
		this.listenTo(this.model, 'change:name', this.invokeSetHeader);
		this.listenTo(this      , 'disposing'  , function(){this.unstickit();});
	},

	afterRender: function(){
		this.stickit();
		this.renderApplianceIndex();
	},

	renderApplianceIndex: function(){
		if (!App.defined(this.model) || this.appliancesIndex){return;}
		var self = this;
		var el = this.$('#service-request-appliances');
		this.appliancesIndex = new App.Views.ApplianceIndexView({
			synced       : true,
			collection   : app.storage.getSubCollection("appliances", {
				service_request_id: this.model.id,
			}, {
				success: function(){
					self.appliancesIndex.attachTo(el, {method: 'html'});
				}
			}),
		});
	},

	serialize: function(){
		var result = (App.defined(this.model)) ? this.model.toJSON() : {};
		result.createdAt = (result.createdAt) ? this.model.dateDDMMYYYY(result.createdAt) : null; 
		result.updatedAt = (result.updatedAt) ? this.model.dateDDMMYYYY(result.updatedAt) : null; 
		result.timestamp = this.timestamp;
		return result;
	},
});