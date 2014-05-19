// Set Template Strategies for all views to JST
Giraffe.View.setTemplateStrategy('jst');

// Delete calling dispose on model when it is removed from a collection.
delete Giraffe.Collection.prototype._removeReference;

window.App = {
	Models     : {},
	Collections: {},
	Routers    : {},
	Views      : {},
	Mixins     : {},

	vent: _.extend({}, Backbone.Events),

	defined: function(object){
		if (typeof object !== "undefined" && object !== null) {
			return true;
		} else {
			return false;
		}
	},

	animate: function(el, animation, callback, context){
		$(el).addClass("animated " + animation);
		var wait = window.setTimeout(function () {
			$(el).removeClass("animated " + animation);
			if(_.isFunction(callback)){callback.apply(context);}
		}, 800);
	},

	animationEnd: 'animationend webkitAnimationEnd MSAnimationEnd oAnimationEnd',

	scrollTo: function(position, offset){
		position = (_.isNumber(position)) ? position : this.elPosition(position);
		offset   = (_.isNumber(offset))   ? offset   : 0;
		var $viewport = $('html, body');
		$viewport.animate({
			scrollTop: position - 60 - offset
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

	isObjectsArray: function(value){
		return _.reduce(value, function(memo, ele){ 
			if(memo === false || !_.isObject(ele)){
				return false;
			} else {
				return true; 
			}
		}, true);
	},
};