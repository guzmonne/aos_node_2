// Set Template Strategies for all views to JST
Giraffe.View.setTemplateStrategy('jst');

window.App = {
	Models     : {},
	Collections: {},
	Routers    : {},
	Views      : {},
	Regions    : {},

	vent: _.extend({}, Backbone.Events),

	defined: function(object){
		if (typeof object !== "undefined" && object !== null) {
			return true;
		} else {
			return false;
		}
	},

	animate: function(el, animation, callback){
		$(el).addClass("animated " + animation);
		var wait = window.setTimeout(function () {
			$(el).removeClass("animated " + animation);
			if(_.isFunction(callback)){callback();}
		}, 800);
	},

	animationEnd: 'animationend webkitAnimationEnd MSAnimationEnd oAnimationEnd',

	scrollTo: function(position){
		var pos;
		var $viewport = $('html, body');
		if (_.isNumber(position)){
			pos = position;
		} else {
			pos = this.elPosition(position);
		}
		$viewport.animate({
			scrollTop: pos
		}, 500);
		$viewport.bind("scroll mousedown DOMMouseScroll mousewheel keyup", function(e){
    	if ( e.which > 0 || e.type === "mousedown" || e.type === "mousewheel"){
    		// This identifies the scroll as a user action, stops the animation, then unbinds the event straight after (optional)
        $viewport.stop().unbind('scroll mousedown DOMMouseScroll mousewheel keyup'); 
    	}
		});  
	},

	elPosition: function(el){
		return $(el).offset().top;
	},

	sseInit: function(){
		if (!!window.EventSource){
			this.vent.source = new EventSource();
			this.vent.source.addEventListener('sse::connection', function(e){
				console.log(e);
			});
			this.vent.onmessage = function(event){
				data = JSON.parse(event.data);
				event = data.event;
				delete data.event;
				this.vent.trigger(event, data);
			};
			this.vent.onerror = function(event){
				if (event.target.readyState === EventSource.CLOSED){
					console.log("Connection failed. Will not retry.");
				}
			};
		} else {
			console.log("EventSource is not supported");
		}
	},
};