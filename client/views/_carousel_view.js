App.Views.CarouselView = App.Views.BaseView.extend({
	template: HBS.carousel_template,

	className: "row",

	initialize: function(){
		if (this.air){
			this.$el.addClass("air-t");
		}
	},

	afterRender: function(){
		var view;
		var carouselItemView = App.Views[this.carouselItemView];
		var options = (this.carouselItemViewOptions) ? this.carouselItemViewOptions : {}; 
		if(!App.defined(carouselItemView)){return;}
		if (!this.collection){return;}
		for(var i = 0; i < this.collection.length; i++){
			options.model     = this.collection.at(i);
			options.className = (i === 0) ? "item active" : "item";
			view              = new carouselItemView(options);
			view.attachTo(this.$('#carousel-items-' + this.cid));
		}
		this.$('#carousel-' + this.cid).carousel({
      interval: 0,
      pause: "hover"
    });
	},

	serialize: function(){
		var options               = {};
		options.cid               = this.cid;
		options.carouselClassName = (this.carouselClassName) ? this.carouselClassName : null;
		options.carouselTitle     = (this.carouselTitle)     ? this.carouselTitle     : null;
		return options;
	},
});