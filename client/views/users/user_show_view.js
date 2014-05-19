App.Views.UserShowView = App.Views.TabView.extend({
	appliancesToolbar: HBS.appliances_toolbar,

	ui: {
		$formView : "#form-view",
		$tableView: "#table-view",
		$carousel : "#tech-appliances-carousel",
		$table    : "#tech-appliances-table",
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
		this.listenTo(this.model, "roles:change", this.techTab);
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
		this.$('#tech-appliances-table').toggleClass('hide');
		this.$('#tech-appliances-carousel').toggleClass('hide');
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
	},


	renderAppliancesTable: function(){
		if (!App.defined(this.model) || App.defined(this.appliancesIndex)){return;}
		var self = this;
		var el   = this.$('#user-appliances-'+ this.timestamp);
		this.appliancesIndex = new App.Views.ApplianceIndexView({
			id: "tech-appliances-table",
			synced: true,
			collection   : app.storage.getSubCollection("appliances", {
				technician_id: this.model.id
			}, {
				success: function(){
					self.appliancesIndex.attachTo(el, {method: 'html'});
					el.prepend(self.appliancesToolbar());
				}
			}),
		});
	},

	renderAppliancesCarousel: function(){
		if (!this.model) {return;}
		if (this.appliancesCarousel){return;}
		var el   = this.$('#tech-appliances-carousel');
		this.appliancesCarousel = new App.Views.ApplianceCarouselView({
			synced    : true,
			collection: app.storage.getSubCollection('appliances', {
				technician_id: this.model.id
			})
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

	bindEvents: function(){
		// Interacts with Row View to activate it
		this.listenTo(app, this.modelName + ':row:rendered', this.announceEntrance);
	},
});