App.Views.ApplianceCarouselView = App.Views.BaseView.extend({
	template: HBS.appliance_carousel_template,

	className: "row air-t",

	modelIndex: 0,

	initialize: function(){
		this.colLength = (this.collection) ? this.collection.length : 0;
	},

	afterRender: function(){
		if (!this.collection){return;}
		this.carouselView = new App.Views.ApplianceEditFormView({
			collection: this.collection,
		});
		this.carouselView.attachTo(this.$('#appliance-form'), {method: 'html'});
	},

	swapModel: function(){
		var model = this.collection.at(this.modelIndex);
	},
});