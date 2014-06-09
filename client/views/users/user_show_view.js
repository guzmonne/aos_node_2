App.Views.UserShowView = App.Views.TabView.extend({
	appliancesToolbar: HBS.appliances_toolbar,

	ui: {
		$formView : "#form-view",
		$tableView: "#table-view",
		$carousel : "#appliances-carousel",
		$table    : "#appliances-table",
	},

	events: {
		'click $tableView': 'changeView',
		'click $formView' : 'changeView',
		'click a'         : 'slideToAppliance',
	},

	name: function(){
		var permissions = this.model.get("permissions");
		if (permissions && permissions.roles && permissions.roles.isTech === true){
			return 'Tecnico: ' + this.model.get('name');
		}
		return 'Usuario: ' + this.model.get('name');
	},

	modelId  : null,
	modelName: 'user',

	awake: function(){
		this.listenTo(this.model, "change:permissions", this.techTab);
	},

	tabs: function(){
		var tabs = [
			{
				id    : 'details',
				title : 'Detalle',
				view  : 'UserDetailsView',
				active: true,
			},
			{
				id            : 'edit',
				title         : 'Editar Datos',
				class         : 'air-t',
				renderFunction: function(){
					this.renderEditForm();
				},
			}
		];
		var permissions = this.model.get("permissions");
		if (permissions && permissions.roles && permissions.roles.isTech === true){
			tabs.splice(1, 0, {
				id: 'appliances',
				title: 'Equipos',
				class : 'air-t',
				renderFunction: function(){
					this.renderAppliancesTable();
				},
			});
		}
		return tabs;
	},

	techTab: function(){
		var self = this;
		var tab  = this.$('#user-appliances');
		var permissions = this.model.get("permissions");
		if (!permissions || !permissions.roles)                       { return; }
		if (this.appliancesIndex && permissions.roles.isTech === true){ return; }
		if (permissions.roles.isTech === true && tab.length > 0)      { return; }
		if (permissions.roles.isTech === true && tab.length === 0){
			this.$('#user-edit').parent().before(
				'<li><a href="#user-appliances-'+this.timestamp+'" data-toggle="tab" id="user-appliances">Equipos</a></li>'
			);
			this.$('#user-edit-' + this.timestamp).before(
				'<div class="tab-pane fade in air-t" id="user-appliances-'+this.timestamp+'"></div>'
			);
			this.$('#user-appliances').on("click", function(e){
				self.$('#user-appliances').off("click");
				self.renderAppliancesTable();
			});
			return;
		}
		if (permissions.roles.isTech === false && tab){
			tab.parent().remove();
			if (this.appliancesIndex){ this.appliancesIndex.dispose(); this.appliancesIndex = undefined; }
			this.$('#user-appliances-'+this.timestamp).remove();
		}
	},

	changeView: function(e){
		if (e) {e.preventDefault();}
		this.$('[data-view=control]'  ).toggleClass('active');
		this.$('[data-view=control]'  ).toggleClass('btn-default-shadow');
		this.$('[data-view=control]'  ).toggleClass('btn-info');
		this.$('#appliances-table'   ).toggleClass('hide');
		this.$('#appliances-carousel').toggleClass('hide');
		this.renderAppliancesCarousel();
	},

	slideToAppliance: function(e){
		var id, index, model, view, collection, el = this.$(e.target).closest('a'); 
		if (el.attr('id') !== "appliance-details"){ return; }
		if (e) {e.preventDefault();}
		id = el.data('id');
		this.changeView();
		view       = this.appliancesCarousel;
		collection = view.collection;
		model      = collection.get(id);
		if (!model){return this.changeView();} 
		index = collection.indexOf(model);
		view.slideTo(index + 1);
		App.scrollTo(this.$el, -70);
	},


	renderAppliancesTable: function(){
		if (!App.defined(this.model) || App.defined(this.appliancesIndex)){return;}
		var el         = this.$('#user-appliances-'+ this.timestamp);
		var collection = this.getAppliancesCollection();
		this.appliancesIndex = new App.Views.ApplianceIndexView({
			id        : "appliances-table",
			collection: collection,
		});
		this.appliancesIndex.attachTo(el, {method: 'html'});
		el.prepend(this.appliancesToolbar());
	},

	renderAppliancesCarousel: function(){
		if (!this.model) {return;}
		if (this.appliancesCarousel){return;}
		var el         = this.$('#appliances-carousel');
		var collection = this.getAppliancesCollection();
		this.appliancesCarousel = new App.Views.ApplianceCarouselView({
			collection: collection
		});
		this.appliancesCarousel.attachTo(el, { method: 'html' });
	},

	renderEditForm: function(){
		if(App.defined(this.editForm)){return;}
		this.editForm = new App.Views.UserFormView({
			model    : this.model,
			edit     : true,
			className: 'row',
		});
		this.editForm.attachTo(this.$('#user-edit-'+ this.timestamp), {method: 'html'});
	},

	getAppliancesCollection: function(){
		var self = this;
		if (!this.appliancesCollection){
			this.appliancesCollection = app.storage.getSubCollection(
				"appliances",
				{
					technician_id: this.model.id
				}, 
				{
					fetch: false,
					matches : function(attributes){
						try {if(attributes.technician_id === self.model.id){return true;}else{return false;}}
						catch (err){return false;}
					}
				}
			);
		}
		app.storage.collection('appliances').fetch({
			data: {
				technician_id: this.model.id
			}
		});
		return this.appliancesCollection;
	},
});