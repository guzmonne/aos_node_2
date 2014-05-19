App.Views.ModelDetailsView = App.Views.ShowView.extend({
	template: HBS.model_details_template,
	className: 'row',

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

	afterRender: function(){
		this.$el.tooltip();
		this.renderApplianceIndex();
		this.invoke('setHeader');
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

	serialize: function(){
		var result = (App.defined(this.model)) ? this.model.toJSON() : {};
		result.createdAt = (result.createdAt) ? this.model.dateDDMMYYYY(result.createdAt) : null; 
		result.updatedAt = (result.updatedAt) ? this.model.dateDDMMYYYY(result.updatedAt) : null; 
		result.timestamp = this.timestamp;
		return result;
	},
});