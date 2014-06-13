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

	statusValue: {
		"Recibido"     : 1,
		"En Reparación": 2,
		"En Espera"    : 3,
		"Atrasado"     : 4,
		"Reparado"     : 5,
		"Entregado"    : 7,
		"Enviado"      : 6
	},

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
		position = (_.isNumber(position))	? position	: this.elPosition(position);
		offset   = (_.isNumber(offset))		? offset		: 0;
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

	dateDDMMYYYY: function(date){
		var parsedDate;
		if (date instanceof Date){
			parsedDate = date;
		} else {
			parsedDate = new Date(date);
		}
		return	parsedDate.getDate() +
			"/" + parsedDate.getMonth() + 
			"/" + parsedDate.getFullYear();
	},

	tryCatch: function(callback, context){
		context = (context) ? context : this;
		try {callback.apply(context);}
		catch (err){console.log(err.stack);}
	},

	extendMixin: function(target, mixin){
		_.extend (target, mixin);
		var functions = _.functions(mixin);
		_.each(functions, function(f){target[f] = _.bind(target[f], target);});
	},
};

App.PDF = (function(window, undefined){
	var punktalLogo = {
		image: 'data:image/png;base64,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'
	};

	var punktalLogoContent = function(){
		return {
			table: {
				headerRows: 1,
				margin: [10, 0],
				widths: ['auto', '*'],
				body: [
					[ 
						_.clone(punktalLogo),
						{
							width: '*',
							alignment: 'right',
							stack: [
								{ style: 'h2', text: 'Dirección de Punktal' },
								{ style: 'h2', text: 'Tel: 099789654' },
								{ style: 'h2', text: 'mail: example@punktal.com' },
								{ style: 'h2', text: 'R.U.T.: 412555587793' }
							]
						}
					],
					[" ", " "]
				]
			},
			layout: 'headerLineOnly'
		};
	};

	var punktalLogoHeader = function(){
		return _.extend({margin: [40, 20, 40, 40]}, punktalLogoContent());
	};

	var styles = {
		defaults: {
			fontSize : 13,
			color    : 'black',
			alignment: 'left'
		},
		tableHeader: {
			bold: true,
			fontSize: 13,
			color: 'black'
		},
		header: {
			fontSize: 18,
			bold: true,
			margin: [0, 0, 0, 10]
		},
		greyHeader: {
			fontSize: 18,
			bold: true,
			margin: [0, 0, 0, 10],
			color: 'grey'
		},
		subHeader: {
			fontSize: 16,
			bold: true,
			margin: [0, 0, 0, 10]
		},
		greySubHeader: {
			fontSize: 16,
			bold: true,
			margin: [0, 0, 0, 10],
			color: 'grey'
		},
		h2: {
      margin: [0, 5, 0, 0],
      fontSize: 10,
      bold: true
		}
	};

	var clientSign = {
		margin: [30, 0,10,0],
		alignment: 'justify',
		table: {
			widths: [140, '*'],
			headerRows: 1,
			body: [
				[_.extend({ text: 'Firma de Cliente:' }, styles.tableHeader), _.extend({ text: '' }, styles.tableHeader)],
				[ '', ''],
			]
		},
		layout: 'headerLineOnly'
	};

	var columnsLorem = {
		columns: [ 
			{ 
				text:'\nLorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit, officiis viveremus aeternum superstitio suspicor alia nostram, quando nostros congressus susceperant concederetur',
				margin: [30, 0,10,0],
				alignment: 'justify',
				fontSize: 9,
			},
			{ 
				margin: [10, 0, 30, 0],
				alignment: 'justify',
				text: '\nLorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit, officiis viveremus aeternum superstitio suspicor alia nostram, quando nostros congressus susceperant concederetur',
				fontSize: 9,
			}
		],
	};

	var columns = function(data){
		if (!_.isArray(data)){throw new Error('The column data must be passed as an array');}
		return {
			columns: data
		};
	};

	var table = function(body, options, layout){
		if (!_.isArray(body)){throw new Error('The table body must be an array and it must include the headers');}
		var defaults = {
			widths: [],
			headerRows: 1,
		};
		var headers = body[0];
		for (var i = 0; i < headers.length; i++){
			defaults.widths.push('*');
		}
		var result = {
			table: _.extend({ body: body }, defaults, options)
		};
		if (App.defined(layout)){result.layout = layout;}
		return result;
	};

	var text = function(text, style){
		var result = {};
		function createObject(opts){
			var sty;
			if (opts.style){
				if (_.isObject(opts.style)){
					sty = opts.style;
				} else if (_.isString(opts.style) && App.defined(styles[opts.style])){
					
					sty = _.extend(styles.defaults, _.clone(styles[opts.style]));
				}
			}
			return _.extend({text: opts.text}, sty);
		}
		if (_.isArray(text)){
			var defObject = {text: ''};
			result.text = [];
			for(var i = 0; i < text.length; i++){
				if(!_.isObject(text[i])){throw new Error('An array of objects must be passed');}
				var object = _.extend(defObject, text[i]);
				result.text.push(createObject(object));
			}
			return result;
		}
		if (_.isString(text)){
			return createObject({text: text, style: style});
		}
	};

	var stack = function(array, options){
		if (!_.isArray(array)){return;}
		var result = {stack: []};
		for (var i = 0; i < array; i++){

		}
	};

	return {
		punktalLogo       : punktalLogo,
		punktalLogoHeader : punktalLogoHeader,
		punktalLogoContent: punktalLogoContent,
		text              : text,
		columns           : columns,
		table             : table,
		clientSign        : clientSign,
		columnsLorem      : columnsLorem,
		stack             : stack,
	};
})();