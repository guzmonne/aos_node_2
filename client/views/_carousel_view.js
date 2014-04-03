App.Views.CarouselView = App.Views.BaseView.extend({
	template: HBS.carousel_template,

	className: "row",

	ui: {
		$range      : "#range-selector",
		$rangeOutput: "output",
		$next       : "#next-model",
		$prev       : "#prev-model",
	},

	events: {
		'change $range': 'moveCarousel',
		'click $next'  : 'updateRange',
		'click $prev'  : 'updateRange',
	},

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
		this.$range.attr("max", this.collection.length);
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

	moveCarousel: function(){
		var rangeVal = parseInt(this.$range.val());
		var slide = rangeVal - 1;
		this.$rangeOutput.val(rangeVal);
		this.$('#carousel-' + this.cid).carousel(slide);
	},

	updateRange: function(e){
		var id = e.currentTarget.id;
		var rangeVal = parseInt(this.$range.val());
		if (id === "next-model"){
			rangeVal = rangeVal + 1;
			if (rangeVal > this.collection.length){
				rangeVal = 1;
			}
		} else if (id === "prev-model"){
			rangeVal = rangeVal - 1;
			if (rangeVal <= 0){
				rangeVal = this.collection.length;
			}
		}
		this.$range.val(rangeVal);
		this.$rangeOutput.val(rangeVal);
	},
});