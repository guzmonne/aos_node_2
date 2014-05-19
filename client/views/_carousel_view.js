App.Views.CarouselView = App.Views.BaseView.extend({
	template: HBS.carousel_template,

	className: "row",

	ui: {
		$range      : "#range-selector",
		$rangeOutput: "output",
		$next       : "#next-model",
		$prev       : "#prev-model",
		$title      : "#carousel-title",
	},

	events: {
		'change $range' : 'moveCarouselTo',
		'click  $next'  : 'updateRange',
		'click  $prev'  : 'updateRange',
		'click  $title' : 'scrollToSlides',
	},

	initialize: function(){
		if (this.air){ this.$el.addClass("air-t"); }
	},

	afterRender: function(){
		this.collection.sort();
		this.createCarousel();
	},

	slideTo: function(index){
		//this.$range.val(index);
		this.moveCarouselTo(index);
	},

	scrollToSlides: function(e){
		e.preventDefault();
		App.scrollTo(this.$title);
	},

	createCarousel: function(){
		var view;
		var carouselItemView = App.Views[this.carouselItemView];
		var options          = (this.carouselItemViewOptions) ? this.carouselItemViewOptions : {};
		var length           = this.collection.length;
		if(!App.defined(carouselItemView)){return;}
		if (!this.collection){return;}
		for(var i = 0; i < length; i++){
			options.model     = this.collection.at(i);
			options.className = (i === 0) ? "item active" : "item";
			view              = new carouselItemView(options);
			view.attachTo(this.$('#carousel-items-' + this.cid));
		}
		this.$range.attr("max", length);
		this.$rangeOutput.val( '1/' + this.collection.length);
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

	moveCarouselTo: function(index){
		index = (_.isNumber(index)) ? index : parseInt(this.$range.val().match(/([0-9])+/g)[0]);
		var slide = index - 1;
		this.$rangeOutput.val(index + '/' + this.collection.length);
		this.$range.val(index);
		this.$('#carousel-' + this.cid).carousel(slide);
	},

	updateRange: function(e){
		var id = e.currentTarget.id;
		var index = parseInt(this.$range.val().match(/([0-9])+/g)[0]);
		if (id === "next-model"){
			index = index + 1;
			if (index > this.collection.length){ index = 1; }
		} else if (id === "prev-model"){
			index = index - 1;
			if (index <= 0){ index = this.collection.length; }
		}
		this.moveCarouselTo(index);
		//this.$range.val(index);
		//this.$rangeOutput.val(index + '/' + this.collection.length);
	},
});