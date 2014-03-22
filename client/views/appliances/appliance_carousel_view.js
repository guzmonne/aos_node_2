App.Views.ApplianceCarouselView = App.Views.BaseView.extend({
	template: HBS.appliance_carousel_template,

	className: "row air-t",

	events: {
		'click #prev-model': 'prevModel',
		'click #next-model': 'nextModel',
	},

	modelIndex: 0,

	initialize: function(){
		this.colLength = (this.collection) ? this.collection.length : 0;
	},

	afterRender: function(){
		if (!this.collection){return;}
		this.swapModel();
	},

	swapModel: function(){
		var model = this.collection.at(this.modelIndex);
		if(this.carouselView){
			this.carouselView.dispose();
		}
		this.carouselView = new App.Views.ApplianceEditFormView({
			model: model
		});
		this.$('#appliance-id').text('ID #' + model.get('id'));
		this.carouselView.attachTo(this.$('#appliance-form'), {method: 'html'});
	},

	prevModel: function(){
		this.modelIndex = this.modelIndex - 1;
		if (this.modelIndex < 0){
			this.modelIndex = this.colLength - 1;
		}
		this.swapModel();
	},

	nextModel: function(){
		this.modelIndex = this.modelIndex + 1;
		if (this.modelIndex >= this.colLength){
			this.modelIndex = 0;
		}
		this.swapModel();
	},
});