App.Views.ModelDetailsView = App.Views.ShowView.extend({
	template: HBS.model_details_template,
	className: 'row',

	bindings: {
		'[name=model]'      : 'model',
		'[name=brand]'      : 'brand',
		'[name=category]'   : 'category',
		'[name=subcategory]': 'subcategory',
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

	ui: {
		$formView : "#form-view",
		$tableView: "#table-view",
		$carousel : "#model-appliances-carousel",
		$table    : "#model-appliances-table",
	},

	events: {
		'click $tableView': 'changeView',
		'click $formView' : 'changeView',
		'click a'         : 'slideToAppliance',
	},

	awake: function(){
		this.listenTo(this.model, 'change:id'  , this.invokeSetHeader);
		this.listenTo(this      , 'disposing'  , function(){this.unstickit();});
	},

	afterRender: function(){
		this.stickit();
		this.$el.tooltip();
		this.renderApplianceIndex();
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
		App.scrollTo(this.$el, -165);
	},

	changeView: function(e){
		if (e) {e.preventDefault();}
		this.$('[data-view=control]'  ).toggleClass('active');
		this.$('[data-view=control]'  ).toggleClass('btn-default-shadow');
		this.$('[data-view=control]'  ).toggleClass('btn-info');
		this.$('[data-view=container]').toggleClass('hide');
		this.renderAppliancesCarousel();
	},

	renderApplianceIndex: function(){
		if (!this.model)         {return;}
		if (this.appliancesIndex){return;}
		var self = this;
		var el   = this.$('#model-appliances-table');
		this.appliancesIndex = new App.Views.ApplianceIndexView({
			synced    : true,
			collection: app.storage.getSubCollection("appliances", {
				model_id: this.model.id
			}, {
				success: function(){
					self.appliancesIndex.attachTo(el, {method: 'html'});
				}
			}),
		});
	},

	renderAppliancesCarousel: function(){
		if (!this.model) {return;}
		if (this.appliancesCarousel){return;}
		var el   = this.$('#model-appliances-carousel');
		this.appliancesCarousel = new App.Views.ApplianceCarouselView({
			synced    : true,
			collection: app.storage.getSubCollection('appliances', {
				model_id: this.model.id
			})
		});
		this.appliancesCarousel.attachTo(el, { method: 'html' });
	},
});