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
		image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJYAAAAiCAIAAAAyOLfWAAAPrUlEQVRogd06aXRUVZrfvW+pqlQqKyEJASEJhABBm0ZAEITW0VYEQRoQFUHk4HbsdhhnTo/dzng83Wd6jkeH8Yxb95nuVhFldWsgLBFRVgUUspCFJD0HyUZVUZWkklrecufHrbzc3PdepZLgzJm5P965dd+3f9/97vfdV4gQAgAAQAhBCMH/qUGFRwgZkyEhGmOoiEM11Mhtm4AvIoT8cM6jlC3ZG0ztuBtWtkO0W0lAMAGiHbsEenGiDipnYvhkBLZc73fhCOkmL9l1GWwEJGZqB2CndeKAHpKn7aglwyJ5M2IW2hxHQyKNEEpeMZY+x8gOhQVLPuYSBDJ9cgCJCaK+kVhyQ0FLk7LBZ6aTDP0BItmdhcmEj10yHF5mtkt0P3Se/18U4LoMzGYGLhboxAgoLmos9wSHy8IPumLGsgxGwgxuhZMtyXWWvhkYEm6aBIlkSDlmJIqgZBjYheEIw9Mu6odNcIQyJCPPkCRMDHy9lMWGPw26YAocusk458PAzWcZv2ahObKWrywpmLlzMMlIwiJyKpC+nMlqymUXwlRAlraytJsdDLe5OdZ2AptRktqFnBXM5x9J7iy0XB9GMCbeOskAJMPdcgtCn2Msz8gkdUlsrmSIsDAD+kKzZNFoVNf1QckBgCgIgihijBFCmqYpimIoLMsyV2UZXDRNU5SYEUWyLGOMY7GYmSlCSBRFQRA49VRVVRSlDwYkSUYIKYpiUJAkSRRFTmBCdCWmaAO5UBUMyZMcnGCEEEVRNE0bCAOCIIqiaHa/osRUNQ6MMZIkGWOcPHcAEMHUVLC2fvGF52tqqhPKj4LBINH1m2fNnjN37q3zF4wdO+7MmW+2vPJyb28PAGRn5/zjr18oLZ3C4hjPCxfO/+43L0WiEfrqH375q2nTyv7tlZcrK89znDyetJWrH1h871Kn08muVxw6+Mbrr9G5w+H4+bN/V1o65bUtr1ZVXaCLj6zbsHrNgwY8ISQUCp07+807f/pjfX0dXcQYZ2VlL753yfQbb3pty6uRSDhZ+wGkpLgf27jpp/cspj872tu2vPrKxYs1AP1xIIriPYuXPPjw2tRUD2fkt99849DBcjovKBj7Ty++VDB2XPLcgbqQHdwubmpuqqqsBAACgJgnnaL4AgBAS8uVL45UrF7z0LObn+vu7KypqQ51dwNAfn5+uLcXBm4+4xnq7q6urgqHwwQIAtQZDCqq0tzHlJEKBAGrqlpSUjqtrIyl0NnZWVVZSQgAApfT2RkMxmKx5uamyspKKqTXexWY88Pv931++PAH27bWVFcpiooQYIzH3TD+rrvvWbZ8xX/9tfliTXWop8esIAAhQDeasUYIoDSP51rgmsHixInj+/ft7eruQgY8AAComlY2/cbZc24RRZE1QmtLS1VlJRUuFApFolHuxB10zu9Z40gf6Ni43wSMMcYCxgIWBIwRwoYqmqYHg8HPPvnoyuXLrOk5yoaqJhaIS17sT4RA0/Xvvj333rt/6gwGgdnKokQTCViNAakbIdTd1bVrx/a33vyPqsoLiqoiBAihqdPKnnr6mbWPrM8fMwZhTDM+ipPso0uYOXO3heKPuDBtbW1/+fSTrq4u+lamOZwAIXCpvr58/95AIGBsEsYgAzRGzJ2DOS+y63Twu9BAGLAdEWCEioqLJ0woFETB0CoajXYGg4qi1NfXKYoCgHw+37lzZ3NycuKSIQvKFoNY+IAuFBSM1XStva0NABRFKd+/r6zsxhUrV6WmplIwSZJouCMTusGfvgyFuvfs3rn13XdaW1sogCAIZWXT//6Xz8/48UxKMCXFPalkcm9vr0FHluWeUKipqZE61el0jp9QyDJyu90ZGekAoGnawfL9586eAQQIwOPx3Lf8fu/VqwcPHAAEkUjkSEXFbbctuuPOu7iTi8InNpSl6ehi3IXc9uT8DAAY41vn3/bk0894PKnGIiFEU7Xz57/9518/f/ny9wCg63pdXS11IS8Xg8XX04g+WIS4/SdOmnTr/AVvv/XGNb+fAHR3dW1978/jJ4xfcNtChDBCSJIkQMgcLgQIIggQBK5dq6+tDUciBw/u371ju9frpbAul2vR7bc/84vNpaVTaAVBCJk6bdqf332fMCkgEo786+9+29zURGVKS0v/cOce1jYIIZcrhRBSX1/38Ue7Q6EQEIIFYebNs9aue1SJxb75+nQwGAQCbW2tu3btmDN3rseTNqBsJDTlDrNHFA1T8qHBGgMIAEiSmJLiSklxc/7Iysp2OF2o72d/LWBT1lkwomkKAZP64rsIY2HZ/Sv8ft+2re+FQiECpKmx8fdvvZmdPWrK1GmCIIiSFEfjE3HcJnt276yoOBSLRv1+fzQaBQAB49Gjc5cuW75+w2MFBWNZeSRJysjMZMn0yD2iKFKvIwCEUGZmpnlPBIPBzz75uKmxkTomJydn8b1Li4snYoxX/GzV+1vfjcViuqZ/dfSLE8eP3/XTu9nSeqg9FTfEwXs4BAgQIaTlSsvxY8dcLpcBo6lqNBptaKjz+30EAQBghEbnjKZC0WKAEEjQlmiaRggx+IuS2HeuAJ1ompqenrH0vuVNjY1fHv2C9hsXLpzfuWP7408+NWZMgSSKA+sG6LNLfBIIBAKBAPvKnZq6eMnSh9euy88fk0B3vl0D26BUVbWmuvLEsa9oES5J0sxZs2fPmSPLMiFkybLlX399qqa6mqbTXTs+LCubPu6GG+xsMtQhcrIaO5I7QnVdP33qZF3tRaNrIQC0q4uEw8FgEAEQAg6HY8bMmYQABUMAhOiKqiS2jjFcrpQByZQQVVUxxiWTS1eveai1tbWu9qKu6z2h0OFDB4qKi1etekCSZNsMRGhZEtclHkkEVEVtbW35/vvLo3NzXS6X3cEzYH1AjuhXhE58Pm/5vn2NjY3UeplZWfPmzRdFqaOjHQAy0jPmzpv/1+ZmesR+e+7soUMH1q3fIEmSmdowRn9fyFZKZn0AIBgMBIMBEwUWEgqLiqdOLautvYixQJOPqmm9PT0cNYOm0+kQ+vpuURRlWRpAEJCmaUCI7HDMu3V+a2vLllde7uzsBID29vbtH7xfOmWqIAhWmzCODwBFxcXu1FRJktpaW9taWwkh4XDv0SOfX+3o2LjpiTv+5k6u0bRWzULZ+Jqu63W1tUeOVITD8SJIVZRjXx09ceIY9TshxO/3GaHf1dV16ED5ggULSyZPjtOKV2P8Td6gUtFhm0jNQxAE7pqDdbfLlVJYVPTzZzfn5uZeutQgyxJ909vbe+rkyZKSUk9amq5pRh2OsdDb23Pq5IlwOEz3i9PpkiRpQKQDURWVquR2u5csua/p0qUPtr2vqgrRtPq6utdf2/KzlasRW32yyAgQwNKlyzc+/oSu69WVla+//u9nz5xRYrFIJPLdt+defOFX9XV1j6x/NDs7uz+7DPF+y+v1frxnd1trq9E4BgKBisOHuK5J13Uqo67rtRdrysv3jSkocLuZwoIgXdd7enr6ehJ+IIRSUlyCwDcRYoKrGWYOGKMfzZgxe/Zc2SEbyBhhURIlWcIIFxUVTywpyc8fgwVBkiSH0wkABCDc2/vhtq2nTp5IS0vz+3xYwBgLgiBkZGZ2dXZeamjQVBUBACIej0eW5T77AxCCEFI11WA3KifnqWd+0dDQcOab07quEV0/feqkz+ejzRXfV0Lcr5IseTweAJg3f35KSso77/zxSEVFd3cX0XWv9+of3n6zrbXlkfWPlk6ZSrlb9FRxYjwL6qQvvzhy9OgRXdcRQhgh2eHAyPqGTFUVRVEIga6urs8PH7rllrk3z5rNuIj4vN5/+c1LssNhiZ6env7s5ucmTpzErdvezrD+AwQY4+nTb1q34TFqjjhTRL0Yv4Q0etXs7FGFhUUtV66oqgYIurtD1VWVVvskXosSBALGEydNSs/IjJczJF6QqKpCGGHy8vI2bno8ELjWUF8HCFRVra2tQQAEmTyIAMiA+gMhNP2mm/5283OjR+fu/ezT9vZ2omuRSHjvXz71er0PPrx27rx5tNw3m4/Eqzp+vaOjfef2DzqDQYQQAcjPz1+48CdOl3Vm7ujoOPbl0VAoRAg0Nl46fPDApEklEO+pAAEKhXpOnzppGIo9IAjAqFGjNmzcZCbL3/9anO1ACCAAECXR7Xa73e4E9QhdHHfDuBUrV/l8vksN9bFYjCY6c7ozCgRZlksml65avSYvL7ezsyv+jhBASFU19pBACN0yd97yFSv+8w+/v+b3Q59lLa1uFlAUxfETCjduejwvL//DbVubm5t0XQ+Hw8ePfdne3tZy5cFl96/IysqyMII5AAE0TS3ft7e6uoqyEwR85113P/Hk03bbyOu9GgwETp86CUB6e3oOHjywYOEiTdf7GynWY333Q4P2jANcaBY9Ly9/fGERAIiCkJWVTT9EcJDmDx1Op2vRT27PyMj8aM8un9fn9/tEQYjGoqqqqoqi6zoWBEEQHbKsqmpGZua8W+fPmj3nRzN+7HA4RaEnLy/fuAHJy8tj5UcIpaamLr53aUd7x4njXymKykrrdDrdqamiKObl5Y8vjFNIz8hgYTDGubl59y1fnuJO+eTjjzra22nmiEWj5fv3SrL0wJqH6KcVA37UqJzxhYU0AumtBX3r9/nPf/dd/pgCSsHtdi+6/Y68/HxBEFiOhn0yMzPvX7HS5/XGFAUABEGoqa5KT0/nrnvsRmZWpsMqOPgPnpwXo9GIrukAAAhEURRFKcmjnl600g83zMHeP+3r/ghCWBAE2upSxFgspvd9rEEYG3Kz53T8gw530YqQJEkYY0VRDAqiJLHlu0FB0zRVVQnbsyIQBFGSJC5AFUXRVNWQwdnXGeu6HovF+ikgRD+W8YcoE+L0M5whNq3GDeKDDIQcDhljgV/uv+X6H/nTww/BZdg0/38IE78bTECXBbCENC8mgDdHqMWHEXtJLMki5hNMMuIZi9yFRgL45EcyWSrx2ySN3M/R0gFJhgNnCDsYOwCLwj2JP0xwR++QBE5etiQBRkj/uvAazn9nYARuGxKj5CNpJC5MHEmWWDDiu+nrOCyaUHYvcw5mpWdzLPdkAVhELi1zbzkArqYYVBNLIoYudicCt+/N8pvJGmVXAqZmwRLIY2lwO/OaF63/ZGcZlQbksEMeGPcPg4hd5kz801KAISHayW9Gt1NwUPgEyg76CtGboQSYdufTUI+iEcaBJZdBw4JjZ95zxrDEHZSgGT55BVkBWAfbudZOHov/zpipcyJahrNdruPgTbd3iaovOzHYRbPAxk8j6Rm4bAI01hNHhnmwBM2Z346mJX1OPGordoVjYa1gMsfMSEZic1wvFj9QRZok4rDpjBCXjv8GmORPlLFQk2cAAAAASUVORK5CYII='
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
App.Storage = (function(){
	var storage;

	var create = function(){
		var colls = {
			clients         : new App.Collections.Clients(),
			service_requests: new App.Collections.ServiceRequests(),
			appliances      : new App.Collections.Appliances(),
			models          : new App.Collections.Models(),
			users           : new App.Collections.Users(),
		};

		var collection = function(collection){
			return this.getCollection(collection, {fetch: false});
		};

		var getCollection = function(collection, options, context){
			if (!collection)        { throw new Error('No "collection" was passed'); }
			if (!colls[collection]) { throw new Error('Collection "'+collection+'" is not defined'); }
			var fetch;
			collection     = colls[collection];
			options        = (options) ? options : {};
			context        = (context) ? context : this;
			fetch          = (options.fetch === false) ? false : true;
			options.remove = false;
			if (fetch === true){ collection.fetch(options); }
			return collection;
		};

		var setModel = function(collection, options, context){
			if (!collection)            { throw new Error('No "collection" was passed'); }
			if (!colls[collection])     { throw new Error('Collection "'+collection+'" is not defined'); }
			var model, id;
			collection = colls[collection];
			options    = (options) ? options : {};
			if (options.attributes && options.attributes._id){ id = options.attributes._id; }
			if (!id && options._id) { id = options._id; }
			if (id){ model = collection.get(id); }
			if (model === undefined){
				model = new collection.model({_id: id});
				collection.add(model);
			}
			if (options.attributes){ model.set(options.attributes); }
			return model;
		};

		var getModel = function(collection, id, options, context){
			if (!collection)            { throw new Error('No "collection" was passed'); }
			if (!colls[collection])     { throw new Error('Collection "'+collection+'" is not defined'); }
			if (!id && !_.isString(id)) { throw new Error('An "id" must be passed'); }
			var model, fetch;
			collection = colls[collection];
			options    = (options) ? options : {};
			context    = (context) ? context : this;
			fetch      = (options.fetch === false) ? false : true;
			model = collection.get(id);
			if (model === undefined){
				model = new collection.model({_id: id});
				collection.add(model);
			}
			if (options.attributes){ model.set(options.attributes); }
			if (fetch === true){ model.fetch(options); }
			return model;
		};

		var setSubCollection = function(collection, objects, options, context){
			if (!collection)        { throw new Error('No "collection" was passed'); }
			if (!colls[collection]) { throw new Error('Collection "'+collection+'" is not defined'); }
			var subCollection;
			collection    = colls[collection];
			subCollection = new collection.constructor();
			options       = (options) ? options : {};
			context       = (context) ? context : this; 
			subCollection.set(collection.set(objects, {remove: false}));
			if (options.filter){
				var filter, matches;
				var getFilter = function(){
					if(_.isFunction(options.filter)){
						return options.filter.apply(context);
					} else {
						return options.filter;
					}
				};
				subCollection.listenTo(collection, 'add', function(model){
					filter  = getFilter();
					matches = _.matches(filter);
					if(matches(model.attributes)){
						subCollection.add(model);
					}
				});
				subCollection.listenTo(collection, 'remove', function(model){
					filter  = getFilter();
					matches = _.matches(filter);
					if(matches(model.attributes)){
						subCollection.remove(model);
					}
				});
				filter = getFilter();
				_.each(_.keys(filter), function(key){
					matches = _.matches(filter);
					subCollection.listenTo(collection, 'change:' + key, function(model){
						if(!matches(model.attributes) && subCollection.get(model)){
							subCollection.remove(model);
						} else if (matches(model.attributes) && !subCollection.get(model)){
							subCollection.add(model);
						}
					});
				});
			}
			return subCollection;
		};

		var getSubCollection = function(collection, condition, options, context){
			if (!collection)        { throw new Error('No "collection" was passed'); }
			if (!colls[collection]) { throw new Error('Collection "'+collection+'" is not defined'); }
			if (!condition && !_.isObject(condition)) { throw new Error('A "condition" must be passed'); }
			var success, fetch, conModels, matches;
			collection    = colls[collection];
			conModels     = collection.where(condition);
			subCollection = new collection.constructor(conModels);
			options       = (options) ? options : {};
			context       = (context) ? context : this;
			fetch         = (options.fetch === false) ? false : true;
			options.data  = condition;
			// add models fetched from the server to the subCollection
			if (options.success){ success = options.success; }
			options.remove  = false;
			options.success = function(){
				conModels = collection.where(condition);
				subCollection.set(conModels, {remove: false});
				if (success){ success.apply(context, arguments); }
			}; 
			if (fetch === true){ collection.fetch(options); }
			// set subCollection events
			matches = (options.matches) ? options.matches : _.matches(condition);
			subCollection.listenTo(collection, "add", function(model){
				if (matches(model.attributes) && !subCollection.get(model.id)){
					subCollection.add(model, {merge: true}); 
				}
			});
			subCollection.listenTo(subCollection, "change", function(model){
				if (!matches(model.attributes)){
					subCollection.remove(model);
				}
			});
			subCollection.listenTo(collection, "change", function(model){
				if (matches(model.attributes) && !subCollection.get(model.id)){
					subCollection.add(model); 
				}
			});
			subCollection.listenTo(collection, "remove", function(model){
				if(subCollection.get(model.id)){
					subCollection.remove(model);
				}
			});
			subCollection.listenTo(collection, "sync", function(){
				subCollection.trigger('sync');
			});
			return subCollection;
		};

		var add = function(collection, model){
			if (!collection)        { throw new Error('No "collection" was passed'); }
			if (!colls[collection]) { throw new Error('Collection "'+collection+'" is not defined'); }
			return colls[collection].add(model, {merge: true});
		};

		var get = function(collection, id){
			if (!collection)        { throw new Error('No "collection" was passed'); }
			if (!colls[collection]) { throw new Error('Collection "'+collection+'" is not defined'); }
			return colls[collection].get(id);
		};

		var remove = function(collection, id){
			if (!collection)        { throw new Error('No "collection" was passed'); }
			if (!colls[collection]) { throw new Error('Collection "'+collection+'" is not defined'); }
			if (id instanceof Giraffe.Model){
				return colls[collection].remove(id);
			}
			return colls[collection].remove(colls[collection].get(id));
		};

		var newModel = function(collection){
			if (!collection)        { throw new Error('No "collection" was passed'); }
			if (!colls[collection]) { throw new Error('Collection "'+collection+'" is not defined'); }
			var model;
			collection = colls[collection];
			model      = new collection.model();
			collection.listenTo(model, 'change:_id', function(){
				collection.add(model);
			});
			collection.listenTo(model, 'disposing', function(){
				collection.stopListening(model);
			});
			return model;
		};

		// Techs Collection Event Handlers
		isTech = function(attributes){
			try{ if (attributes.permissions.roles.isTech === true){return true;}else{return false;} }
			catch(err){return false;}
		};
		colls.techs = new App.Collections.Users();
		colls.techs.listenTo(colls.users, 'add', function(model){
			if (isTech(model.attributes)){colls.techs.add(model, {merge: true});}
		});
		colls.techs.listenTo(colls.users, 'remove', function(model){
			if (isTech(model.attributes)){colls.techs.remove(model);}
		});
		colls.techs.listenTo(colls.users, 'change', function(model){
			if (isTech(model.attributes)){colls.techs.add(model, {merge: true});}
		});
		colls.techs.listenTo(colls.techs, 'change', function(model){
			if (!isTech(model.attributes)){colls.techs.remove(model);}
		});
		colls.techs.listenTo(colls.users, 'sync', function(){
			colls.techs.trigger('sync');
		});

		return {
			setSubCollection: setSubCollection,
			setModel        : setModel,
			getCollection   : getCollection,
			getModel        : getModel,
			getSubCollection: getSubCollection,
			add             : add,
			remove          : remove,
			get             : get,
			newModel        : newModel,
			collection      : collection,
		};
	};

	return {
		getInstance: function(){
			if (!storage){ storage = create(); } 
			return storage;
		}
	};
})();
App.Mixins.PDFReport = {
	pdfReportDownload: function(){
		var filename = (_.isFunction(this.reportName)) ? this.reportName() : 'file.pdf'; 
		pdfMake.createPdf(this.pdfReport()).download(filename);
	},

	pdfReportPrint: function(){
		pdfMake.createPdf(this.pdfReport()).print();
	},
};
App.Mixins.AppliancePDFReport = _.extend({
	reportName: function(){
		return 'Equipo_' + this.get('id') + '.pdf';
	},

	pdfReport: function(){
		return {
			pageSize   : 'A4',
			pageMargins: [ 40, 15, 40, 15 ],
			content    : this.appliancePDFMulti(3),
		};
	},

	appliancePDFMulti: function(copies){
		var result = [];
		var single = this.appliancePDFSingle();
		for(var i = 0; i < copies; i++){
			result.push(this.appliancePDFSingle());
		}
		return result;
	},

	appliancePDFSingle: function(){
		return {
			stack: [
				App.PDF.punktalLogoContent(),
				this.appliancePDFBody()
			]
		};
	},

	appliancePDFBody: function(){
		var cLengthS = 12;
		var cLengthM = 18;
		var cLengthL = 78;
		var bLine    = 3;
		var lHeight  = 14;
		var appliance, phone, address, email, accessories, obs, defect, serial;
		try {
			appliance        = this.attributes;
			appliance.client = app.storage.get('clients', appliance.client_id).attributes;
			appliance.model  = app.storage.get('models' , appliance.model_id ).attributes;
		} catch (err) {console.log(err.stack); return;}
		phone      = (_.isArray(appliance.client.phones)    && appliance.client.phones.length    > 0) ? appliance.client.phones[0].number : " ";
		address    = (_.isArray(appliance.client.addresses) && appliance.client.addresses.length > 0) ? appliance.client.addresses[0]     : " ";
		if (_.isObject(address)) {address = address.street + ', ' + address.city + ', ' + address.department + '.';} 
		accessories = (_.isArray(appliance.accessories) && appliance.accessories.length > 1) ? appliance.accessories.join(', ')   : " ";
		email       = (!_.isUndefined(appliance.client.email))                                ? appliance.client.email             : " ";
		obs         = (_.isString(appliance.observations)) ? appliance.observations.replace(/(\r\n|\n|\r)/gm," ") : " ";
		defect      = (_.isString(appliance.defect))       ? appliance.defect.replace(/(\r\n|\n|\r)/gm," ")       : " ";
		serial      = (_.isString(appliance.serial) && appliance.serial !== '') ? appliance.serial : " ";
		if (address.length > cLengthS)			{bLine--;}
		if (address.length > 2 * cLengthS)	{bLine--;}
		if (accessories.length > cLengthM)	{bLine--;}
		if (obs.length    > cLengthL/2)			{bLine--;} 
		if (defect.length > cLengthL/2)			{bLine--;}
		if (bLine < 0){bLine = 0;}
		return [
			{
				columns: [
					{
						width: 200,
						stack: [
							{columns: [ {text: "Nombre: "                       , width: 80, bold: true}, appliance.client.name.substring(0, cLengthM) ]},
							{columns: [ {text: appliance.client["doc-type"]+": ", width: 80, bold: true}, appliance.client["doc-number"].substring(0, cLengthM) ]},
							{columns: [ {text: "Telefono: "                     , width: 80, bold: true}, phone.substring(0, cLengthM) ]},
							{columns: [ {text: "Direccion: "                    , width: 80, bold: true}, address.substring(0, 3*cLengthM) ]},
							{columns: [ {text: "Email: "                        , width: 80, bold: true}, email.substring(0, cLengthM) ]},
						],
					},
					{
						width: '*',
						margin: [10, 0, 0, 0],
						stack: [
							{	 
								columns: [ 
									{text: "ID: ", fontSize: 25, width: 50}, {text: appliance.id.toString(), fontSize: 25, bold: true}, 
								], 
								margin: [0,-14, 0, 0], 
							},
							{
								columns: [
									{text: "Marca: "  , width: 50, bold: true},
									{text: appliance.model.brand.substring(0, cLengthS)  , width: 70},
									{text: "Modelo: " , width: 65, bold: true},
									{text: appliance.model.model.substring(0, cLengthM)  , width: "*"},
								]
							},
							{
								columns: [
									{text: "Serie: ", width: 50, bold: true},
									{text: serial.substring(0, cLengthS), width: 70},
									{text: "Accesorios: ", width: 65, bold: true},
									{text: accessories.substring(0, cLengthM*2), width: "*"}, //36
								]
							},
							{
								columns: [
									{text: "Obs: ", width: 50, bold: true},
									{text: obs.substring(0, cLengthL), width: "*"},
								]
							},
							{
								columns: [
									{text: "Defecto: ", width: 50, bold: true},
									{text: defect.substring(0, cLengthL), width: "*"}, 
								]
							},
						],
					},
				],
			},
			{
				table: {
					headerRows: 1,
					widths: ['*', '*'],
					body: [
						[
							{text: " ", margin: [0, (lHeight*bLine), 0, 0]},
							" "
						], 
						[
							{"text": "Fecha de Impreso: " + moment(new Date()).format('DD/MM/YYYY HH:mm'), alignment: "left", margin: [0, 0, 0, 20]},
							{"text": "Fecha de Ingreso: " + moment(appliance.createdAt).format('DD/MM/YYYY HH:mm'), alignment: "right"}
						] 
					]
				},
				layout: "headerLineOnly"
			},
		];
	},
}, App.Mixins.PDFReport);
// !!!
// Type: Mixin
// -----
// Description:
// ------------
// This mixin has the necessary functions to be able to select the model from a modal
// view. Is important to add the necessary events that will trigger this functions.
// ------------ 
// !!!
App.Mixins.SelectModel = {
	// !!!
	// Type: Void
	// -----
	// Description:
	// ------------
	// This method calls the modal controller to display an index view of the models.
	// ------------ 
	// !!!
	selectModel: function(e){
		if(e){e.preventDefault();}
		if(!this.modelSelectModalView){
			this.modelSelectModalView = new App.Views.ModelSelectModalView();
		}
		app.modalController.displayModal(this.modelSelectModalView, this, 'modelSelected');
	},

	// !!!
	// Type: Void
	// -----
	// Description:
	// ------------
	// This function should be triggered by an appEvent. When called the model is picked up
	// and added to the current view model.
	// ------------ 
	// !!!
	modelSelected: function(model){
		if(!this.model.prevModelId){ this.model.prevModelId = this.model.get('model_id'); }
		this.model.set('model_id', model.id);
	},

	// !!!
	// Type: Object
	// -----
	// Description:
	// ------------
	// Serializes the model and passes the information of the model to the template for easy
	// rendering.
	// ------------ 
	// !!!
	serialize: function(){
		var object = this.model.toJSON();
		var model  = this.model.model_id;
		if (model){
			_.extend(object, model.pick('brand', 'category', 'subcategory', 'model'));
		}
		return object;
	},

	setModelDetails: function(){
		try {
			var model = app.storage.getModel('models', this.model.get('model_id'), {fetch: false});
			this.$('[name=brand]'      ).val(model.get('brand'));
			this.$('[name=model]'      ).val(model.get('model'));
			this.$('[name=category]'   ).val(model.get('category'));
			this.$('[name=subcategory]').val(model.get('subcategory'));
		} catch (err) {
			if (err.message !== 'An "id" must be passed'){console.log(err.stack);}
			return;
		}
	},

	setAccessories: function(){
		var self = this;
		var accessories = this.model.get('accessories');
		_.each(accessories, function(accessory){
			self.$('[name=accessories]').tagsinput("add", accessory);
		});
	},
};
App.Mixins.ServiceRequestAppliancesPDFReport = _.extend({
	reportName: function(){
		if (this.models.length === 0) {return 'file.pdf';}
		var service_request_id;
		try { 
			service_request_id = app.storage.get('service_requests', this.models[0].get('service_request_id')).get('id');
		} catch (err) {console.log(err.stack); return 'file.pdf';}
		return 'Equipos_de_OdeS_' + service_request_id + '.pdf';
	},

	pdfReport: function(){
		return {
			pageSize   : 'A4',
			pageMargins: [ 40, 15, 40, 15 ],
			content    : this.reportContent()
		};
	},

	reportContent: function(){
		if (this.length === 0) {return;}
		if (this.length === 1) {
			return this.models[0].appliancePDFMulti(3);
		}
		var result = [];
		_.each(this.models, function(model, index, models){
			var stack = {
				stack: model.appliancePDFMulti(3)
			};
			if (index !== (models.length - 1)){stack.pageBreak = 'after';}
			result.push(stack);
		});
		return result;
	},
}, App.Mixins.PDFReport);
App.Mixins.ServiceRequestPDFReport = _.extend({
	reportName: function(){
		return 'OdeS_' + this.get('id') + '.pdf';
	},

	pdfReport: function(){
		return {
			pageSize: 'A4',
			pageMargins: [ 40, 100, 40, 100 ],
			header: App.PDF.punktalLogoHeader(),
			content: this.reportContent(),
			footer: [
				App.PDF.clientSign,
				App.PDF.columnsLorem,
			]
		};
	},

	reportContent: function(){
		var self = this;
		var body = {}, tbody = [], clientName = '', content = [];
		try {clientName = app.storage.get('clients', this.get('client_id')).get('name');}
		catch(err){console.log(err.stack);}
		var h1 = App.PDF.text([
				{text: 'Numero de Orden: ', style: 'header'},
				{text: this.get('id').toString(), style: 'greyHeader'},
			]
		);
		var h2 = App.PDF.text(
			[
				{text: 'Cliente: ', style: 'subHeader'},
				{text: clientName, style: 'greySubHeader'},
			]
		);
		var tBodyHeader = [
			App.PDF.text('IDS'          , 'tableHeader'), 
			App.PDF.text('Marca'        , 'tableHeader'), 
			App.PDF.text('Modelo'       , 'tableHeader'), 
			App.PDF.text('Cantidad'     , 'tableHeader'), 
			App.PDF.text('Observaciones', 'tableHeader')
		];
		tbody.push(tBodyHeader);
		body = this.fillTableObject();
		_.each(body, function(value, key, list){
			var array = [
				value._ids, 
				value.brand,
				value.model,
				{text: value.qty.toString(), alignment: 'center'},
			];
			var obs = '';
			if (value.serials !== ''){obs = 'Series: ' + value.serials;}
			if (value.defects !== ''){
				if (obs !== ''){obs = obs + '\n'; }
				obs = obs + 'Defectos: ' + value.defects;
			}
			array.push(obs);
			tbody.push(array);
		});
		content.push(App.PDF.columns(
			[
				{stack: [h1, h2]},
				App.PDF.text(moment(new Date()).format('DD/MM/YYYY'), {margin: [0, 5, 0, 10], alignment: 'right'})
			]
		));
		content.push(App.PDF.table(tbody, {widths: [ 30, 60, 50, 50, '*' ]}, 'lightHorizontalLines'));
		return content;
	}, 

	fillTableObject: function(){
		var body = {}, model_id, model, appliance, appliancesIds = this.get('appliances');
		for(var i = 0; i < appliancesIds.length; i++){
			try {
				if (_.isObject(appliancesIds[i])){
					appliance = appliancesIds[i];
				} else {
					appliance = app.storage.get('appliances', appliancesIds[i]).attributes;
				}
			}
			catch(err){console.log(err.stack); throw new Error("Can't find appliance");}
			try {
				model_id = appliance.model_id;
				model    = app.storage.get('models', model_id);
			}
			catch(err){console.log(err.stack); throw new Error("Can't find model");}
			if (body[model_id]){
				body[model_id].qty++;
				body[model_id]._ids = body[model_id]._ids + '; ' + appliance.id; 
				if (appliance.serial){
					body[model_id].serials = body[model_id].serials + '; ' + appliance.serial; 
				}
				if (appliance.defect){
					body[model_id].defects = body[model_id].defects + '; ' + appliance.defect; 
				}
			} else {
				body[model_id] = {
					_ids: appliance.id.toString(),
					qty: 1,
					model: model.get('model'),
					brand: model.get('brand')
				};
				body[model_id].serials = (appliance.serial)  ? appliance.serial : '';
				body[model_id].defects = (appliance.defects) ? appliance.defects : '';
			}
		}
		return body;
	},
}, App.Mixins.PDFReport);
// !!!
// Type: Mixin
// -----
// Description:
// ------------
// Mixin that adds the necessary functions to announce the entrance or exit of a show view.
// The show views extend this mixin to let the row views if they are called or are disposed.
// ------------ 
// !!!
App.Mixins.ShowViewAnnouncer = {
	// !!!
	// Type: Void
	// -----
	// Description:
	// ------------
	// Function called to announce that a show view is active. It triggers an event
	// that is ussualy caught by the row views to mark the row as active
	// ------------ 
	// !!!
	modelShowActive: function(){
		this.model.trigger('model:show:active');
	},

	// !!!
	// Type: Void
	// -----
	// Description:
	// ------------
	// Function called to announce that a show view is active. It triggers an event
	// that is ussualy caught by the row views to mark the row as active
	// ------------ 
	// !!!
	modelShowInactive: function(){
		this.model.trigger('model:show:inactive');
	},
};
App.Mixins.UserIndex = (function(window, undefined){
	var userShowButton = function(source, type, val){
		var model = app.storage.get('users', source._id);
		if(type === "display"){ return model.userShowButton(); }
		return source._id;
	};

	var userRoles = function(source, type, val){
		var model = app.storage.get('users', source._id);
		if(type === "display"){ return model.userRoles(); }
		var result = [];
		if (source.permissions.roles.isAdmin === true){result.push('Administrador');}
		if (source.permissions.roles.isTech  === true){result.push('Tecnico');}
		return result.join(' ');
	};

	var userData = function(source, type, val){
		var model = app.storage.get('users', source._id);
		if(type === "sort")   {return source.name;}
		if(type === "display"){ return model.userDetails(); }
		return [source.name, source.email].join(' ');
	};

	var dataTableOptions = {
		"columnDefs": [
			{ "searchable": false, "targets": -1 },
			{ "className": "center-vh", "targets": -1 },
		],
		"columns": [
			{"data": userData      , "defaultContent": "" },
			{"data": userRoles     , "defaultContent": ""	},
			{"data": userShowButton, "defaultContent": "" }
		]
	};
	
	return {
		dataTableOptions: dataTableOptions,
		userShowButton  : userShowButton,
		userRoles       : userRoles,
		userData        : userData
	};
})();
App.Models.BaseModel = Giraffe.Model.extend({
	// So Backbone can use the '_id' value of our Mongo documents as the documents id
	idAttribute: '_id',

	initialize: function(){
		this.awake.apply(this, arguments);
		//Giraffe.Model.prototype.initialize.apply(this, arguments);
	},

	setRelatedField: function(collectionName, relatedFieldName, attributeName, name){
		var relatedField, result;
		if (!_.isString(collectionName))    {throw new Error('A collection name must be passes as a string');}
		if (!_.isString(relatedFieldName))  {throw new Error('A related field value must be passes as a string');}
		if (!_.isString(attributeName))     {throw new Error('An attribute name must be passes as a string');}
		relatedField = this.get(relatedFieldName);
		if(!relatedField){return;}
		name = (name) ? name : attributeName;
		try{
			result = app.storage.get(collectionName, relatedField).get(attributeName);
		} catch (err){
			return console.log(err.stack);
		}
		this.set(name, result);
		return result;
	},

	awake: function(){},

	push: function(attribute, value){
		var array = this.get(attribute);
		if (!_.isArray(array)){
			this.set(attribute, []);
		}
		array.push(value);
		this.set(attribute, array);
		this.trigger('change', this);
		this.trigger('change:' + attribute, this);
		return this;
	},

	pop: function(attribute, index){
		var array = this.get(attribute);
		if (!_.isArray(array)){return;}
		array.splice(index, 1);
		this.set(attribute, []).set(attribute, array);
		this.trigger('change', this);
		this.trigger('change:' + attribute, this);
		return this;
	},

	getAt: function(attribute, index){
		var array = this.get(attribute);
		if (!_.isArray(array)){return;}
		return array[index];
	},

	setDates: function(){
		var date, dates = ['createdAt', 'updatedAt', 'closedAt'];
		for (var i = 0; i < dates.length; i++){
			date = this.get(dates[i]);
			if (!_.isUndefined(date)){
				try {
					this.set(dates[i] + '_short', moment(date).format('DD/MM/YYYY'));
				} catch (err) {
					console.log(err.stack);
				}
			}
		}
	},

	cleanField: function(attributeName){
		if (!_.isString(attributeName)){throw new Error('The attributeName must be a string');}
		var attribute = this.get(attributeName);
		if (!attribute || attribute === ''){ 
			this.set(attributeName, null);
		}
	},

	// Just a basic function to parse a 'Date()' type.
	//dateDDMMYYYY: function(date){
	//	var parsedDate;
	//	if (date instanceof Date){
	//		parsedDate = date;
	//	} else {
	//		parsedDate = new Date(date);
	//	}
	//	return  parsedDate.getDate() +
	//		"/" + parsedDate.getMonth() + 
	//		"/" + parsedDate.getFullYear();
	//},

	downloadButton: function(){
		var id = this.id;
		return	'<a href="#" class="btn btn-xs btn-info btn-margin"  name="'+this.name+'-download" data-id="'+id+'" data-toggle="tooltip" data-placement="top" title="Download">' +
							'<i class="fa fa-download fa-fw"></i>' +
						'</a>';
	},

	printButton: function(){
		var id = this.id;
		return	'<a href="#" class="btn btn-xs btn-info btn-margin"  name="'+this.name+'-print" data-id="'+id+'" data-toggle="tooltip" data-placement="top" title="Imprimir">' +
							'<i class="fa fa-print fa-fw"></i>' +
						'</a>';
	},

	showButton: function(icon){
		var id = this.id;
		icon = (icon) ? icon : 'fa-ellipsis-h';
		return	'<a href="#render/'+this.name+'/show/'+id+'" class="btn btn-xs btn-green btn-margin"  id="'+this.name+'-details" data-id="'+id+'" data-toggle="tooltip" data-placement="top" title="Mas Información">' +
							'<i class="fa '+icon+' fa-fw"></i>' +
						'</a>';
	},
});
App.Models.Appliance = App.Models.BaseModel.extend({
	urlRoot: '/api/appliances',
	name   : 'appliance',

	defaults: function(){
		return {
			'status'            : 'Recibido',
			'createdBy'         : 'Guzman Monne',
			'updatedBy'         : 'Guzman Monne',
		};
	},

	awake: function(){
		this.listenTo(this, 'change:repairement_type', this.checkCost);
		this.listenTo(this, 'sync', this.setRelatedFields);
		this.listenTo(this, 'add' , this.setRelatedFields);
		App.extendMixin(this, App.Mixins.AppliancePDFReport);
	},

	setRelatedFields: function(){
		this.setClientName();
		this.setModelAndBrand();
		this.setTechnicianName();
		this.setDates();
		this.setSerial();
	},

	setClientName: function(){
		this.setRelatedField('clients', 'client_id', 'name', 'client_name');
	},

	setModelAndBrand: function(){
		this.setRelatedField('models', 'model_id', 'brand');
		this.setRelatedField('models', 'model_id', 'model');
	},

	setTechnicianName: function(){
		this.setRelatedField('techs', 'technician_id', 'name', 'technician_name');
	},

	setSerial: function(){
		this.cleanField('serial');
	},

	checkCost: function(){
		var repType = this.get('repairement_type');
		var cost    = this.get('cost');
		if (repType === 'Garantía'){
			if (App.defined(cost) && cost > 0){
				this.set('cost', 0);
			}
		}
	},

	statusClass: function(status){
		var className;
		switch (status){
		case "Recibido":
				className = "btn-status-1";
				break;
		case "En Reparación":
				className = "btn-status-2";
				break;
		case "En Espera":
				className = "btn-status-3";
				break;
		case "Atrasado":
				className = "btn-status-4";
				break;
		case "Reparado":
				className = "btn-status-5";
				break;
		case "Entregado":
				className = "btn-status-7";
				break;
		case "Enviado":
				className = "btn-status-6";
				break;
		}
		return className;
	},

	statusLabel: function(){
		var status = this.get('status');
		return	'<h4 style="margin: 0px;">' +
							'<span class="label label-default ' + this.statusClass(status) + '">' + 
								status +
							'</span>'+
						'</h4>';
	},

	budgetList: function(){
		var cost = this.get('cost');
		cost = (cost) ? cost : 0;
		return	'<dt>Presupuesto</dt>' +
						'<dd>$'+cost+',00</dd>';
	},

	datesList: function(){
		var dates = [
			this.get('createdAt_short'),
			this.get('updatedAt_short'),
			this.get('closedAt_short')
		];
		var html =
			'<dt>Creado</dt>' + 
			'<dd>'+ dates[0] +'</dd>' +
			'<dt>Actualizado</dt>' +
			'<dd>'+ dates[1] +'</dd>';
		if (dates.length === 3) {
			html = html + 
			'<dt>Cerrado</dt>' +
			'<dd>'+ dates[2] +'</dd>';
		}
		return html;
	},

	showServiceRequestButton: function(){
		return App.Models.BaseModel.prototype.showButton.apply({id: this.get('service_request_id'), name: "service_request"}, ['fa-clipboard']);
	},
});
App.Models.Client = App.Models.BaseModel.extend({
	urlRoot: '/api/clients',
	name   : 'client',

	defaults: function(){
		return {
			'createdBy' : 'Guzmán Monné',
			'updatedBy' : 'Guzmán Monné'
		};
	},
});
App.Models.Model = App.Models.BaseModel.extend({
	
	url: function(){
		var u = '/api/models';
		if (this.id){
			u = u + '/' + this.id;
		}
		return u;
	},

	defaults: function(){
		return {
			'createdBy'  : 'Guzmán Monné',
			'updatedBy'  : 'Guzmán Monné'
		};
	},
});
App.Models.ServiceRequest = App.Models.BaseModel.extend({
	urlRoot: '/api/service_requests',
	name   : 'service_request',

	defaults: function(){
		return {
			'status'        : 'Pendiente',
			'createdBy'     : 'Guzmán Monné',
			'updatedBy'     : 'Guzmán Monné',
		};
	},

	awake: function(){
		this.listenTo(this, 'sync', this.setRelatedFields);
		this.listenTo(this, 'add' , this.setRelatedFields);
		App.extendMixin(this, App.Mixins.ServiceRequestPDFReport);
	},

	setRelatedFields: function(){
		this.setClientName();
		this.setAppliancesCount();
		this.setInvoiceNumber();
		this.setDates();
	},

	setAppliancesCount: function(){
		var appliances = this.get('appliances');
		var length = (_.isArray(appliances)) ? appliances.length: 0;
		this.set('appliancesCount', length);
	},

	setClientName: function(){
		this.setRelatedField('clients', 'client_id', 'name', 'client_name');
	},

	setInvoiceNumber: function(){
		this.cleanField('invoiceNumber');
	},

	serialize: function(){
		var attributes = this.toJSON();
		attributes.appliancesCount = this.get('appliances').length;
		return attributes;
	},
});
App.Models.User = App.Models.BaseModel.extend({
	urlRoot: '/api/users',

	defaults: function(){
		return {
			'createdBy'  : 'Guzmán Monné',
			'updatedBy'  : 'Guzmán Monné',
		};
	},

	userDetails: function(){
		var name  = this.get('name');
		var email = this.get('email');
		var html  = '<dd><i class="fa fa-user fa-fw"></i>'+name+'</dd>';
		if (email){html = html + '<dd><i class="fa fa-envelope fa-fw"></i>'+email+'</dd>';}
		return html;
	},

	userRoles: function(){
		var html = '<dt>Roles</dt>';
		var permissions = this.get('permissions');
		if (permissions.roles.isAdmin === true){html = html + '<dd>Administrador</dd>';}
		if (permissions.roles.isTech  === true){html = html + '<dd>Tecnico</dd>';}
		return html;
	},

	userShowButton: function(){
		var id = this.id;
		return	'<a href="#render/user/show/'+id+'" class="btn btn-xs btn-green"  id="user-details" data-toggle="tooltip" data-placement="top" title="Mas Información">' +
							'<i class="fa fa-ellipsis-h fa-fw"></i>' +
						'</a>';
	},
});
App.Collections.BaseCollection = Giraffe.Collection.extend({
	comparator: 'id',

	initialize: function(){
		this.awake.apply(this, arguments);
	},
});
App.Collections.Appliances = App.Collections.BaseCollection.extend({
	url: '/api/appliances',
	model: App.Models.Appliance,

	awake: function(){
		App.extendMixin(this, App.Mixins.ServiceRequestAppliancesPDFReport);
	},
});
App.Collections.Clients = Giraffe.Collection.extend({
	url  : '/api/clients',
	model: App.Models.Client,
});
App.Collections.Models = Giraffe.Collection.extend({
	url  : '/api/models',
	model: App.Models.Model,
});
App.Collections.ServiceRequests = Giraffe.Collection.extend({
	// !!!
	// Type: String
	// -----
	// Description:
	// ------------
	// If the collection has a client_id parameter then we call for only the service_requests
	// assigned to that client
	// ------------ 
	// !!!
	url  : function(){
		var u = '/api/service_requests';
		if (this.client_id){
			u = u + '/client/' + this.client_id;
		}
		return u;
	},

	model: App.Models.ServiceRequest,
});
App.Collections.Users = Giraffe.Collection.extend({
	url  : '/api/users',
	model: App.Models.User,
});
App.Views.BaseView = Giraffe.View.extend({
	awake: function(){},
	
	// !!!
	// Type: Boolean
	// -------------
	// Description:
	// ------------
	// When the 'sync' button is pressed this function gets called to see if the 
	// current portlet-child view has the 'onSync()' method needed to sync the 
	// data.
	// ------------
	// !!!
	canSync: function(){
		if (App.defined(this.onSync)){ this.onSync(); return true; } else { return false; }
	},

	// !!!
	// Type: Void
	// -----
	// Description:
	// ------------
	// This function should be called after the onSync() method ends to stop the portlet spinner
	// ------------
	// !!!
	afterSync: function(message){
		this.invoke("stopSpin", message);
	},

	// !!!
	// Type: Void
	// -----
	// Description:
	// ------------
	// Checks if the 'value' is bigger than 1 and then sets the target text to plural or singular
	// ------------ 
	// Arguments:
	// ----------
	// value [Number]      : Value to check if its bigger than one
	// target [DOM element]: Dom element to set the resulting text
	// singular [String]   : Singular value to set the 'target' text
	// plural [String]     : Plural value to set the 'target' text  
	// ----------
	// !!!
	pluralize: function(value, target, singular, plural){
		var el = $(target);
		if (value > 1){
			el.text(plural);
		} else {
			el.text(singular);
		}
	},

	// !!!
	// Type: Void
	// -----
	// Description:
	// ------------
	// Function called when clicket the portlet close button. It disposes the Portlet view 
	// and adds a simple animation.
	// ------------ 
	// Arguments:
	// ----------
	// e [Event]: click event
	// ----------
	// !!!
	closeView: function(e){
		if(App.defined(e)){
			e.preventDefault();
		}
		var self = this;
		//this.dispose();
		this.$el.addClass('closing');
		setTimeout(function(){
			self.dispose();
		}, 500);
		//App.animate(this.$el, 'slideOutUp', function(){
		//	self.dispose();
		//});
	},

	// !!!
	// Type: JSON
	// -----
	// Description:
	// ------------
	// Basic serialize functions for the views. It just calls the 'toJSON()' method if 
	// the view has a model
	// ------------ 
	// !!!
	serialize: function(){
		if (App.defined(this.model)){
			return this.model.toJSON();
		}
	},

	// !!!
	// Type: String
	// -----
	// Description:
	// ------------
	// Returns a string with the first character capitalizes
	// ------------ 
	// Arguments:
	// ----------
	// string [String]: String to be capitalized
	// ----------
	// !!!
	capitaliseFirstLetter: function(string){
		return string.charAt(0).toUpperCase() + string.slice(1);
	},

	// !!!
	// Type: String
	// -----
	// Description:
	// ------------
	// Takes a string that can be a word or a collection of words separated by
	// underscores and returns a sting with every word capitalized and no spaces
	// ------------ 
	// Arguments:
	// ----------
	// doc [String]: String to be titelized. Can only be a word or a group of words
	// separated by an underscore.
	// ----------
	// !!!	
	titelize: function(doc){
		var docName = '';
		if (doc.indexOf('_') === -1){
			docName = this.capitaliseFirstLetter(doc);
		} else {
			var nameArray = doc.split('_');
			for(var i = 0; i < nameArray.length; i++){
				docName = docName + this.capitaliseFirstLetter(nameArray[i]); 
			}
		}
		return docName;
	},

	// !!!
	// Type: Void
	// -----
	// Description:
	// ------------
	// Trigers an event that is captured by the portlet view which will then display a 
	// message based on the options passed
	// ------------ 
	// Arguments:
	// ----------
	// options [Object]: object with the necessary parameters to display a message on a Portlet
	// View.
	// ----------
	// !!!
	displayPortletMessage: function(options){
		var defaultOptions = {
			viewCid: this.parent.cid,
			title  : 'Titulo:',
			message: 'Cuerpo del mensaje',
		};
		var opts = typeof options !== 'undefined' ? options : defaultOptions; 
		app.trigger('portlet:message', opts);
	},

	// !!!
	// Type: Void
	// -----
	// Description:
	// ------------
	// Blocks almost all inputs on a form
	// ------------ 
	// !!!
	blockForm: function(){
		this.$('input').attr('readonly', true);
		this.$('textarea').attr('readonly', true);
		this.$('select').attr('disabled', true);
		this.$('span[data-role=remove]').attr('data-role', 'not-remove');
		this.$('input[type=checkbox]').attr('disabled', true);
	},

	// !!!
	// Type: Void
	// -----
	// Description:
	// ------------
	// Unblocks almost all inputs on a form
	// ------------ 
	// !!!
	unblockForm: function(){
		this.$('input').attr('readonly', false);
		this.$('textarea').attr('readonly', false);
		this.$('select').attr('disabled', false);
		this.$('span[data-role=not-remove]').attr('data-role', 'remove');
		this.$('input[type=checkbox]').attr('disabled', false);
	},

	// !!!
	// Type: Void
	// -----
	// Description:
	// ------------
	// Activates the tagsinput plugin depending on the passed event.
	// ------------ 
	// Arguments:
	// ----------
	// e [Event]: Ussualy a click event.
	// ----------
	// !!!
	activateTags: function(e){
		if (!e){return;}
		this.$(e.currentTarget).closest('.bootstrap-tagsinput').addClass('active');
	},

	// !!!
	// Type: Void
	// -----
	// Description:
	// ------------
	// Deactivates the tagsinput plugin on an element passed on the event.
	// ------------ 
	// Arguments:
	// ----------
	// e [Event]: Ussualy a click event.
	// ----------
	// !!!
	deactivateTags: function(e){
		if (!e){return;}
		var input = this.$(e.target);
		var value = input.val();
		if (value !== ''){
			this.$(e.target.offsetParent).find('select').tagsinput('add', value);
			input.val('');
		}
		this.$('.bootstrap-tagsinput').removeClass('active');
	},

	// !!!
	// Type: Void
	// -----
	// Description:
	// ------------
	// Function called to announce that a show view is active. It triggers an event
	// that is ussualy caught by the row views to mark the row as active
	// ------------ 
	// !!!
	//announce: function(){
	//	if(!App.defined(this.model)){return;}
	//	app.trigger(this.modelName + ':show:active', this.model.id);
	//},

	updateViewField: function(fieldName, value){
		value = (value) ? value : this.model.get(fieldName); 
		var field = this.$('[name='+ fieldName +']:input');
		if (!field){ return; }
		if (field.attr('type') === "checkbox"){
			return field.prop("checked", value);
		}
		if (field.is('input') || field.is('select') || field.is('textarea')){ 
			return field.val(value);
		}
	},

	updateViewText: function(field){
		this.$('[name='+ field +']').text(this.model.get(field));
	},

	invoke: function() {
    var args, methodName, view;
		methodName = arguments[0]; 
		args       = (2 <= arguments.length) ? Array.prototype.slice.call(arguments, 1) : [];
		view       = this;
    while (view && !view[methodName]) {
      view = view.parent;
    }
    if (view !== null ? view[methodName] : void 0) {
      return view[methodName].apply(view, args);
    } else {
      //error('No such method name in view hierarchy', methodName, args, this);
      return false;
    }
  },

	sync: function(type, options){
		if (!type){return;}
		var success, self = this;
		options        = (options) ? options : {};
		success        = options.success;
		options.remove = (options.remove)    ? options.remove    : true;
		options.add    = (options.add)       ? options.add       : true;
		options.merge  = (options.merge)     ? options.merge     : true;
		options.success = function(){
			if (success) {success.apply(this, arguments);}
			self.afterSync();
		};
		if (type === "model" && this.model){
			this.model.fetch(options);
		}
		if (type === "collection" && this.collection){
			this.collection.fetch(options);
		}
  },

  invokeSetHeader: function(){
		this.invoke('setHeader');
	},

	print: function(e){
		e.preventDefault();
		var model = this.getModelFromTarget(e);
		if (_.isUndefined(model)){return;}
		model.pdfReportPrint();
	},

	download: function(e){
		e.preventDefault();
		var model = this.getModelFromTarget(e);
		if (_.isUndefined(model)){return;}
		fileName = (_.isFunction(this.reportName)) ? this.reportName(model) : 'file.pdf';
		model.pdfReportDownload(fileName);
	},

	getModelFromTarget: function(e){
		var model, id = this.$(e.target).closest('a').data('id');
		try {
			model = app.storage.get(this.collectionName, id);
		} catch (err) {
			console.log(err.stack); return undefined;
		}
		return model;
	},
});
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
App.Views.FormView = App.Views.BaseView.extend({
	edit  : false,
	editOn: false,
	focus : '',

	createSuccessMessage: {
		title  : 'Exito',
		message: 'Se han guardado los datos con exito',
		class  : 'success',
	},

	createErrorMessage: {
		title  : 'Error',
		message: 'Ha ocurrido un error. Por favor vuelva a intentar en unos minutos',
		class  : 'danger',
	},
	
	updateSuccessMessage: {
		title  : 'Exito',
		message: 'Se han actualizado los cambios con exito',
		class  : 'success',
	},

	updateErrorMessage: {
		title  : 'Error',
		message: 'Ha ocurrido un error. Por favor vuelva a intentar en unos minutos',
		class  : 'danger',
	},

	constructor: function(){
		if (this.formEvents){
			_.extend(this.events, this.formEvents);
		}
		App.Views.BaseView.apply(this, arguments);
	},

	initialize: function(){
		this.awake.apply(this, arguments);
		this.bindEvents.apply(this, arguments);
		_.once(this.editForm);
		_.once(this.newForm);
	},

	bindEvents: function(){},
	awake: function(){},

	events: {
		'submit form'             : 'submitForm',
		'click button#reset-model': 'reRender',
		'click button#edit-model' : 'editModel',
		'click .checkbox label'   : 'toggleCheckBox',
	},

	reRender: function(e){
		if (e){e.preventDefault();}
		this.editOn = false;
		this.render();
	},

	afterRender: function(){
		if (this.edit){
			this.editForm();
		} else {
			this.newForm();
		}
	},

	newForm: function(){
		this.$('#edit-model').remove();
	},

	editForm: function(){
		this.$('#save-model').remove();
		this.blockForm();
	},

	editModel: function(e){
		if (e){e.preventDefault();}
		this.editOn = (this.editOn) ? false : true;
		if (this.editOn){
			this.unblockForm();
			this.$(this.focus).focus();
		} else {
			this.blockForm();
		}
		this.$('.btn').toggleClass('hide');
	},

	submitForm: function(e){
		if (e){e.preventDefault();}
		if (this.edit){
			this.updateModel();
		} else {
			this.createModel();
		}
	},

	createModel: function(e){
		var self = this;
		if (e){e.preventDefault();}
		this.saveModel();
		this.model.save({}, {
			success: function(model){
				self.invoke('showMessage', self.createSuccessMessage);
			},
			error: function(model){
				self.invoke('showMessage', self.createErrorMessage);
			}
		});
		this.model = app.storage.newModel(self.storage);
		this.bindEvents();
		this.cleanForm();
	},

	updateModel: function(e){
		var self = this;
		if (e){e.preventDefault();}
		this.saveModel();
		this.model.save({}, {
			success: function(model){
				self.invoke('showMessage', self.updateSuccessMessage);
			},
			error: function(model){
				self.invoke('showMessage', self.updateErrorMessage);
			}
		});
		this.editModel();
	},

	saveModel: function(){
		this.model.set(this.$('form').formParams());
	},

	cleanForm: function(){
		this.$('input').val('');
		this.$('textare').text('');
		this.$('input[type=checkbox]').val(false);
		this.$('input[type=radio]').val(false);
		this.$(this.focus).focus();
	},

	toggleCheckBox: function(e){
		var name     = e.target.htmlFor;
		var checkbox = this.$('[name='+name+']');
		if (checkbox.attr("disabled")){return;}
		checkbox.prop("checked", !checkbox.prop('checked'));
	},
});
App.Views.ModalView = App.Views.BaseView.extend({
	template: HBS.modal_base_layout_template,
	
	modalOptions: {
		header      : true,
		footer      : true,
		customFooter: false,
		title       : '',
		modalClass  : false,
	},

	initialize: function(){
		if (!this.bodyView){return;}
		if (this.bodyView.modalOptions){_.extend(this.modalOptions, this.bodyView.modalOptions);}
	},

	attributes: function(){
		return {
			'class'          : "modal fade",
			'tabindex'       : "-1",
			'role'           : "dialog",
			'aria-labelledby': this.name,
			'aria-hidden'    : true,
			'id'             : 'modalContainer',
		};
	},

	afterRender: function(){
		this.bodyView.attachTo('.modal-body', {method: 'html'});
	},
	
	serialize: function(){
		return this.modalOptions;
	}
});
App.Views.NewView = App.Views.BaseView.extend({
	className: "row",

	afterRender: function(){
		this.renderForm();
	},

	renderForm: function(){
		if(!App.defined(this.formViewName)){return new Error('formViewName not defined');}
		this.formView = new App.Views[this.formViewName]({
			model: this.model,
		});
		this.formView.attachTo(this.$el, {method: 'html'});
	},
});
App.Views.RowView = App.Views.BaseView.extend({
	tagName  : 'tr',
	
	activated  : false,

	events: {
		'click #selected': 'selected',
	},
	
	initialize: function(){
		this.awake.apply(this, arguments);
		this.listenTo(this.model, 'change' , this.render);
		this.listenTo(this.model, 'remove', this.invokeRemoveRow);
	},

	afterRender: function(){
		if (this.active){this.activate();}
		app.trigger('row:rendered', this.model.id);
		this.$el.tooltip();
		if(this.parent.selection){
			this.$('a#show').remove();
			this.$('a#selected').removeClass('hide');
		}
		if(_.isFunction(this.onceRendered)){this.onceRendered();}
	},

	selected: function(){
		if(!App.defined(this.model)){return;}
		app.modalController.runCallerMethod(this.model);
	},

	serialize: function(){
		if(!App.defined(this.model)){return;}
		if (_.isFunction(this.model.serialize)){
			return this.model.serialize();
		} else {
			return this.model.toJSON();
		}
	},
});
App.Views.ShowView = App.Views.BaseView.extend({

	initialize: function(){
		this.awake.apply(this, arguments);
	},
});
App.Views.TabView = App.Views.BaseView.extend({
	template: HBS.tabs_template,

	tabs              : {},
	tabDetails        : {},
	activeView        : null,

	events: {},

	bindEvents: function(){},

	initialize: function(){
		this.awake.apply(this, arguments);
		if(!this.modelName){return new Error('View must have a modelName defined');}
		this.timestamp = _.uniqueId();
		this.createTabs();
		this.bindEvents.apply(this);
		this.listenTo(this.model, 'sync', this.setHeader);
	},
	
	createTabs: function(){
		var self   = this;
		var object = {
			modelName: this.modelName,
			tab      : [],
		};
		var tabs = _.result(self, 'tabs');
		_.forEach(tabs, function(tab, index){
			var tabFunction;
			var tabDetails = {
				href : self.modelName + "-" + tab.id + "-" + self.timestamp,
				id   : self.modelName + "-" + tab.id,
				title: tab.title,
			};
			if (tab.class){
				tabDetails.class = tab.class; 
			}
			if (_.isFunction(tab.renderFunction)){
				tabFunction = tab.renderFunction;
			} else {
				tabFunction = function(){	
					self.renderTabView(tab.id, tab.view);
				};
			}
			if(tab.active){
				tabDetails.active = true;
				self.activeView   = tabFunction;
			} else {
				self["renderTab" + index] = tabFunction;
				self.events['click #' + self.modelName + "-" + tab.id] = "renderTab" + index;
			}
			object.tab.push(tabDetails);
		});
		this.tabDetails = object;
	},

	renderTabView: function(id, viewName){
		if (!App.defined(this[id])){
			this[id] = new App.Views[viewName]({model: this.model});
			this[id].attachTo(this.$('#' + this.modelName + '-' + id + '-' + this.timestamp), {method: 'html'});
		}
	},

	afterRender: function(){
		if (_.isFunction(this.activeView)){this.activeView();}
		this.invoke('setHeader');
	},

	serialize: function(){
		return this.tabDetails;
	},
});
App.Views.TableView = App.Views.BaseView.extend({
	constructor: function(options){
		this.rowViewOptions   = {};
		this.fetchOptions     = {};
		this.dataTableOptions = {};
		this.rendered = false;
		this.synced   = (options.synced) ? options.synced : false;
		if (this.moreEvents) {_.extend(this.events, this.moreEvents);}
		Giraffe.View.apply(this, arguments);
	},

	events: {
		'click a[name=select]': 'selected',
	},

	initialize: function(){
		var self = this;
		this.awake.apply(this, arguments);
		this.listenTo(this.collection, 'sync', this.tableFetched);
		this.timestamp = _.uniqueId();
	},

	bindEvents: function(){
		this.listenTo(this.collection, 'change', this.updateTable);
		this.listenTo(this.collection, 'add'   , this.addRow);
	},

	serialize: function(){
		return {
			timestamp: this.timestamp,
		};
	},

	afterRender: function(){
		var self = this;
		if(!App.defined(this.tableEl)){
			throw new Error('Attribute tableEl must be set.');
		}
		if(this.synced === true && this.rendered === false){ this.appendCollection(); }
		this.rendered = true;
	},

	appendCollection: function(collection){
		var self    = this;
		var options = _.extend({
			//"scrollY"       : 600,
			//"scrollCollapse": true,
			"deferRender"   : true,
			"stateSave"     : true,
			"stateDuration" : -1,
			"data"          : this.collection.toJSON(),
			//"scrollX"       : true,
			//"sScrollXInner" : "100%",
			//"sScrollX"      : "98%",
		}, this.dataTableOptions);
		// Table jQuery Object
		this.$table  = this.$(this.tableEl + "-" + this.timestamp);
		// Table Datatable Object
		this.$oTable = this.$table.dataTable(options);
		// Table Datatable API Object
		this.oTable  = this.$oTable.api();
		this.$('.dataTables_scrollHead').css('margin-bottom', '-20px');
		this.bindEvents();
	},

	tableFetched: function(){
		if(this.rendered === true && this.synced === false){ this.appendCollection(); }
		this.synced = true;
	},	

	append: function(model){
		if (!App.defined(this.modelView)){throw new Error('Option modelView not defined');}
		this.rowViewOptions.model = model;
		var view = new this.modelView(this.rowViewOptions);
		this.addChild(view);
		this.oTable.row.add(view.model.toJSON());
	},

	onSync: function(){
		this.sync("collection", this.fetchOptions);
	},

	getModelIndex: function(model){
		if(!this.$oTable){return;}
		if(_.isString(model)){model = this.collection.get(model);}
		return this.collection.indexOf(model);
	},

	updateTable: function(model){
		var index = this.getModelIndex(model);
		if(!index){return;}
		this.$oTable.fnUpdate(model.attributes, index);
	},

	addRow: function(model){
		var rowNode = this.oTable.row.add(model.attributes).draw().node();
		App.animate(this.$(rowNode), 'fadeIn');
	},

	selected: function(e){
		if (e) {e.preventDefault();}
		var id = this.$(e.target).closest('a').data('id');
		var model = this.collection.get(id);
		if (model){
			app.modalController.runCallerMethod(model);
		}
	},
});
App.Views.Renderer = App.Views.BaseView.extend({
	
	appEvents: {
		'render:doc'           : 'docView',
		'render:show'          : 'showView',
	},

	viewTree: {
		"client" : {
			storage: "clients",
			model  : "Client",
		},
		"service_request": {
			storage: "service_requests",
			model  : "ServiceRequest"
		},
		"appliance": {
			storage: "appliances",
			model  : "Appliance",
		},
		"model": {
			storage: "models",
			model  : "Model",
		}, 
		"user": {
			storage: "users",
			model  : "User",
		},
		"tech": {
			storage: "techs",
			model  : "Tech"
		}
	},

	showView: function(doc, id){
		var treeInfo = this.viewTree[doc];
		if (!treeInfo) { throw new Error('Invalid doc: "'+ doc +'" on showView'); }
		if (!id)       { throw new Error('No "id" was passed'); }
		var params = _.extend({
			viewName         : treeInfo.model + 'ShowView',
			viewType         : "show",
			portletFrameClass: "green",
			options: {
				_id: id
			}
		}, treeInfo);
		this.showOrGoTo(params, this.showComparator);
	},

	docView: function(doc, type){
		var treeInfo = this.viewTree[doc];
		if (!treeInfo) { throw new Error('Invalid doc: "'+ doc +'" on showView'); }
		if (!type)     { throw new Error('No "type" was passed'); }
		var params = _.extend({
			viewName : treeInfo.model + this.titelize(type) + 'View',
			viewType : type,
		}, treeInfo);
		if (type === "index"){
			params.collection = true;
		}
		this.showOrGoTo(params);
	},

	defaultComparator: function(view){
		return (
			view instanceof(App.Views.PortletView)	&& 
			App.defined(view.viewName)							&& 
			view.viewName === this.viewName
		);
	},

	showComparator: function(portletView){
		return (
			portletView instanceof(App.Views.PortletView)	&&
			App.defined(portletView.view)									&&
			App.defined(portletView.view.model)						&&
			App.defined(portletView.viewName)							&& 
			portletView.viewName === this.viewName				&&
			portletView.view.model.id === this.options._id
		);
	},

	showOrGoTo: function(params, comparator){
		if (!params)                     { throw new Error('"params" must be defined'); }
		if (!params.viewName)            { throw new Error('"params.viewName" must be defined'); }
		if (!App.Views[params.viewName]) { throw new Error('View "App.Views.'+params.viewName+'" is not defined'); } 
		var renderedView;
		Backbone.history.navigate((Backbone.history.fragment).replace('render/', ''));
		comparator   = (comparator) ? comparator : this.defaultComparator;
		renderedView = this.viewIsRendered(comparator, params);
		if (renderedView){
			App.scrollTo(renderedView.el);
		} else {
			this.show(params);
		}
	},

	show: function(params){
		if(!params || !_.isObject(params)){ throw new Error('"params" must be defined'); }
		var model, collection, fetchOptions, portletView;
		switch (params.viewType){
		case "show":
			if (params.model instanceof Giraffe.Model){ 
				model = params.model; 
			} else {
				model = app.storage.getModel(params.storage, params.options._id, {fetch: false});
			} 
			params.view  = new App.Views[params.viewName]({model: model});
			if (params.fetch === undefined || params.fetch === true){
				fetchOptions = (params.view.fetchOptions) ? params.view.fetchOptions : {};
				model.fetch(fetchOptions);
			}
			break;
		case "new":
			if (params.model instanceof Giraffe.Model){
				model = params.model;
			} else {
				model = app.storage.newModel(params.storage);
			}
			params.view = new App.Views[params.viewName]({model: model});
			break;
		case "index":
			collection   = app.storage.collection(params.storage);
			params.view  = new App.Views[params.viewName]({collection: collection});
			if (params.fetch === undefined || params.fetch === true){
				fetchOptions = (params.view.fetchOptions) ? params.view.fetchOptions : {};
				collection.fetch(fetchOptions);
			}
			break;
		}
		portletView = new App.Views.PortletView(_.pick(params, "view", "viewName", "portletFrameClass", "flash"));
		this.appendToContent(portletView);
		App.scrollTo(portletView.el);
	},

	viewIsRendered: function(comparator, context){
		var self = (context) ? context : this;
		var result = null;
		for(var i = 0; i < app.children.length; i++){
			if ( comparator.apply(self, [ app.children[i] ]) ){
				result = app.children[i];
				break;
			}
		}
		return result;
	},

	appendToContent: function(view){
		app.attach(view, {el: '#content-el', method: 'prepend'});
	},
});
App.Views.ApplianceRowView = App.Views.RowView.extend({
	template: HBS.appliance_row_template,
	modelName: 'appliance',

	serialize: function(){
		var object = {};
		if (App.defined(this.model)){
			object        = this.model.toJSON();
			var createdAt = this.model.get('createdAt');
			var updatedAt = this.model.get('updatedAt');
			var closedAt  = this.model.get('closedAt');
			if (object.client_id){
				object.client_name = app.storage.collection("clients").get(object.client_id).get('name');
			}
			if (object.technician_id){
				object.technician_name = app.storage.collection("techs").get(object.technician_id).get('name');
			}
			if(object.model_id){
				_.extend(object, app.storage.collection("models").get(object.model_id).pick('brand', 'category', 'subcategory', 'model'));
			}
			object.createdAt =	(App.defined(createdAt))	?	this.model.dateDDMMYYYY(createdAt)	:	null;
			object.updatedAt =	(App.defined(updatedAt))	? this.model.dateDDMMYYYY(updatedAt)	: null;
			object.closedAt  =	(App.defined(closedAt))		? this.model.dateDDMMYYYY(closedAt)		: null;
		}
		return object;
	},
});
App.Views.ApplianceCarouselView = App.Views.CarouselView.extend({
	air              : true,
	carouselItemView : "ApplianceEditFormView",
	carouselClassName: "col-lg-offset-2 col-lg-8 col-md-12",
	carouselTitle    : "Equipos",
});
App.Views.ApplianceEditFormView = App.Views.BaseView.extend({
	template: HBS.appliance_edit_form_template,

	editMode: false, 

	events: {
		'click ul.dropdown-menu.status li a'   : "setStatus",
		'click #edit-appliance'                : "editAppliance",
		'click #save-appliance'                : "saveAppliance",
		'click #render-appliance'              : "reRender",
		'focus .bootstrap-tagsinput input'     : 'activateTags',
		'focusout .bootstrap-tagsinput input'  : 'deactivateTags',
		'change select[name=status]'           : 'changeStatus',
		'change select[name=repairement_type]' : 'setRepairementType',
	},

	initialize: function(){
		_.extend(this, App.Mixins.SelectModel);
		_.bindAll(this, 'selectModel', 'modelSelected', 'serialize', 'setAccessories', 'setModelDetails');
		this.$el.on('click', 'button#select-model', this.selectModel);
		this.listenTo(this      , 'disposing'              , this.selectModelOff);
		this.listenTo(this.model, 'change:id'              , function(){this.updateViewField.apply(this, ['id']);});
		this.listenTo(this.model, 'change:serial'          , function(){this.updateViewField.apply(this, ['serial']);});
		this.listenTo(this.model, 'change:observations'    , function(){this.updateViewField.apply(this, ['observations']);});
		this.listenTo(this.model, 'change:cost'            , function(){this.updateViewField.apply(this, ['cost']);});
		this.listenTo(this.model, 'change:defect'          , function(){this.updateViewField.apply(this, ['defect']);});
		this.listenTo(this.model, 'change:diagnose'        , function(){this.updateViewField.apply(this, ['diagnose']);});
		this.listenTo(this.model, 'change:replacements'    , function(){this.updateViewField.apply(this, ['replacements']);});
		this.listenTo(this.model, 'change:solution'        , function(){this.updateViewField.apply(this, ['solution']);});
		this.listenTo(this.model, 'change:technician_id'   , this.setTechnician);
		this.listenTo(this.model, 'change:accessories'     , this.setAccessories);
		this.listenTo(this.model, 'change:model_id'        , this.setModelDetails);
		this.listenTo(this.model, 'change:status'          , this.changeStatus);
		this.listenTo(this.model, 'change:repairement_type', function(){
			this.updateViewField.apply(this, ['repairement_type']);
			this.setRepairementType();	
		});
		this.listenTo(app.storage.collection("techs"), 'add'   , this.fillTechnicianField);
		this.listenTo(app.storage.collection("techs"), 'remove', this.fillTechnicianField);
	},

	afterRender: function(){
		this.$('[name=accessories]').tagsinput();
		this.$('[name=replacements]').tagsinput();
		this.fillTechnicianField();
		if(!this.editMode){
			this.blockForm();
			this.toggleButtons();
		}
		this.setRepairementType();
		this.changeStatus();
		this.setModelDetails();
	},

	toggleButtons: function(){
		this.$('#controls > button').toggleClass('hide');
		this.$('#select-model').toggleClass('hide');
		this.$('button#status-dropdown').attr('disabled', !this.$('button#status-dropdown').attr('disabled'));
	},

	fillTechnicianField: function(){
		var technicians = _.map(app.storage.collection("techs").models, function(model){
			return {id: model.id, name: model.get("name")};
		});
		var field = this.$('[name=technician_id]');
		field.empty();
		_.each(technicians, function(technician){
			if (!technician.id || !technician.name){return;}
			field.append(
				'<option value="'+technician.id+'">'+technician.name+'</option>'
			);
		});
		field.prepend(
				'<option value="" selected></option>'
		);
		this.setTechnician();
	},

	setRepairementType: function(){
		var repairementTypeVal = this.$('[name=repairement_type]').val();
		if (repairementTypeVal === "Presupuesto"){
			this.$('#cost-form-group').show();
		} else {
			this.$('#cost-form-group').hide();
		}
	},

	setTechnician: function(){
		var id = this.model.get('technician_id');
		if (!id || id === '') {
			this.$('[name=technician_link]').attr('disabled', true);
		} else {
			this.$('[name=technician_id]').val(id);
			this.$('[name=technician_link]').attr('href', '#render/user/show/' + id);
			this.$('[name=technician_link]').attr('disabled', false);
		}
	},

	changeStatus: function(){
		var status = this.model.get('status');
		var value  = App.statusValue[status];
		var classes = "btn btn-block dropdown-toggle btn-status btn-status-" + value;
		this.$('button#status-dropdown').removeClass().addClass(classes).text(status);
	},

	setStatus: function(e){
		if (e) {e.preventDefault();}
		var status = this.$(e.target).closest('a').text();
		this.model.set("status", status);
	},

	editAppliance: function(e){
		e.preventDefault();
		this.unblockForm();
		this.toggleButtons();
		this.editMode = true;
	},

	saveAppliance: function(e){
		var self    = this;
		e.preventDefault();
		this.saveModel();
		this.model.save(null, {
			success: function(){
				self.invoke('showMessage', {
					title  : 'Equipo Actualizado',
					message: 'El equipo se ha actualizado con exito',
					class  : 'success',
				});
				self.model.prevModelId = self.model.get('model_id');
			}
		});
		this.editMode = false;
		this.blockForm();
		this.toggleButtons();
	},

	reRender: function(e){
		e.preventDefault();
		this.editMode = false;
		if (this.model.prevModelId){ this.model.set('model_id', this.model.prevModelId); }
		this.render();
	},

	saveModel: function(){
		this.model.set(_.pick(this.$('form').formParams(), 
			'serial',
			'observations',
			'repairement_type', 
			'defect',
			'accessories',
			'replacements',
			'diagnose',
			'solution',
			'technician_id',
			'repairement_type',
			'cost'
		));
	},

	selectModelOff: function(){
		this.$el.off('click', 'button#select-model');
	},
});
App.Views.ApplianceIndexView = App.Views.TableView.extend({
	template      : HBS.appliance_index_template,
	className     : "row",
	name          : "Equipos",
	collectionName: "appliances",
	
	tableEl        : '#appliances-table',

	moreEvents: {
		'click a[name=appliance-print]'   : 'print',
		'click a[name=appliance-download]': 'download',
		'click #printAppliancesPDF'       : 'printAppliances',
		'click #downloadAppliancesPDF'    : 'downloadAppliances',
	},
	
	awake: function(){
		this.dataTableOptions = {
			"columnDefs": [
				{ "searchable": false, "targets": -1 },
				{ "className": "center-vh", "targets": [0, 5, 6, 8, 9] },
				{ "className": "center-v", "targets": -1 },
				{ "className": "center-v" , "targets": [1, 2, 3, 4, 7] },
				{ "width": "40px", "targets": -1}
			],
			"columns": [
				{"data": "id"},
				{"data": "client_name", "defaultContent": ""},
				{"data": "model"      , "defaultContent": ""},
				{"data": "brand"      , "defaultContent": ""},
				{"data": "serial"     , "defaultContent": "S/S"},
				{"data": this.repairementType},
				{"data": this.status},
				{"data": "technician_name", "defaultContent": "S/A"},
				{"data": "createdAt_short", "defaultContent": ""},
				{"data": "closedAt_short" , "defaultContent": "Abierto"},
				{"data": this.buttons     , "defaultContent": "" }
			],
		};
	},

	buttons: function(source, type, val){
		var model = app.storage.get('appliances', source._id);
		var ids = [source._id, source.service_request_id];
		if(type === "display"){
			return model.showButton()+model.printButton()+model.showServiceRequestButton()+model.downloadButton();
		}
		return ids.join(' ');
	},

	dates: function(source, type, val){
		var model = app.storage.get('appliances', source._id);
		if (type === 'display'){ model.datesList(); }
		return dates.join(' ');
	},

	status: function(source, type, val){
		var model = app.storage.get('appliances', source._id);
		if(type === 'display'){
			return model.statusLabel();
		}
		return source.status;
	},

	repairementType: function(source, type, val){
		var model = app.storage.get('appliances', source._id);
		var rep = source.repairement_type;
		if(type === 'display' && rep === "Presupuesto"){ return model.budgetList(); }
		if (parseInt(source.cost) > 0){rep = rep + ' ' + source.cost;}
		return rep;
	},

	printAppliances: function(e){
		e.preventDefault();
		this.collection.pdfReportPrint();
	},

	downloadAppliances: function(e){
		e.preventDefault();
		this.collection.pdfReportDownload();
	},

	showReportButtons: function(){
		this.$('#report-buttons').removeClass('hide');
	},
});
App.Views.ApplianceMultipleFormDetailsModalView = App.Views.BaseView.extend({
	template: HBS.appliance_multiple_form_details_modal_template,
	row     : HBS.appliance_multiple_form_details_modal_row_template,
	name      : "ApplianceMultipleFormDetailsModalView",
	
	className: "row",

	modalOptions: {
		title     : "Detalles",
		footer    : false,
		modalClass: "modal-lg",
	},

	events: {
		'click button[name=save-details]'   : 'saveDetails',
		'change input[type=checkbox]'       : 'applyFilters',
		'change input[name=serial]'         : function(e){this.updateDetails(e, "serial");},
		'change select[name=accessories]'   : function(e){this.updateDetails(e, "accessories");},
		'change textarea[name=observations]': function(e){this.updateDetails(e, "observations");},
		'change textarea[name=defect]'      : function(e){this.updateDetails(e, "defect");},
	},

	initialize: function(){
		this.details = (this.details) ? this.details : {};
	},

	afterRender: function(){
		var options;
		for(var i = 0; i < this.quantity; i++){
			options = _.extend(
				{id: i+1}, 
				this.details[i+1]
			);
			this.$('tbody').append(this.row(options));
		}
		this.$('[name=accessories]').tagsinput();
	},

	serialize: function(){
		var model = app.storage.collection("models").get(this.model_id);
		if (model && model.attributes){
			return model.attributes;
		}
		return;
	},

	applyFilters: function(e){
		var checkbox, column, $el, tabindex;
		checkbox = this.$(e.target).closest('input');
		column   = checkbox.data('name');
		if (column === 'accessories'){
			$el = this.$(".bootstrap-tagsinput input"); 
			$el.parent().toggleClass('disabled');
		} else {
			$el = this.$("[name="+column+"]");
		}
		$el.attr("disabled", !checkbox.prop('checked'));
	},

	updateDetails: function(e, field){
		var $tr                 = this.$(e.target).closest('tr');
		var id                  = $tr.find('td[name=id]').text();
		this.details[id]        = (this.details[id]) ? this.details[id] : {};
		this.details[id][field] = $tr.find('[name='+field+']').val();
	},

	saveDetails: function(){
		app.modalController.runCallerMethod(this.rowId, this.details);
	},
});
App.Views.ApplianceMultipleFormView = App.Views.BaseView.extend({
	className: "col-lg-12",
	template: HBS.appliance_multiple_form_template,
	row     : HBS.appliance_multiple_form_row_template,

	events: {
		'click button[name=select-model]'      : 'renderSelectModel',
		'click button[name=remove-row]'        : 'removeRow',
		'click button[name=add-row]'           : 'addRow',
		'click button[name=more-details]'      : 'moreDetails',
		'focus .bootstrap-tagsinput input'     : 'activateTags',
		'focusout .bootstrap-tagsinput input'  : 'deactivateTags',
	},

	initialize: function(){
		this.$tr     = undefined;
		this.details = {};
	},

	afterRender: function(){
		this.newRow();
		this.$el.tooltip();
	},

	selectModel: function(e){
		if(e){e.preventDefault();}
		if (	
			!App.defined(this.modelSelectModalView)								|| 
			!App.defined(this.modelSelectModalView.app))
		{
			this.modelSelectModalView = new App.Views.ModelSelectModalView();
		}
		app.modalController.displayModal(this.modelSelectModalView, this, 'modelSelected');
	},

	activeRow: function(row){
		this.$tr = this.$('tr[data-row='+row+']');
	},

	newRow: function(row){
		row = row ? row : _.uniqueId();
		this.$('tbody').prepend(this.row({row: row}));
	},

	renderSelectModel: function(e){
		e.preventDefault();
		this.activeRow(this.$(e.target).closest('tr').data("row"));
		this.selectModel();
	},

	modelSelected: function(model){
		this.$tr.find('dt[name=brand]'   ).text(model.get('brand'));
		this.$tr.find('dd[name=model]'   ).text(model.get('model'));
		this.$tr.find('dd[name=model_id]').text(model.id);
		this.$tr.find('button[name=select-model]').remove();
		this.$tr.find('div[name=model-edit]').append(
			'<button class="btn btn-warning pull-right" name="select-model">' +
				'<i class="fa fa-desktop fa-fw"></i>'                           +
			'</button>'
		);
	},

	addRow: function(e){
		e.preventDefault();
		this.activeRow(this.$(e.target).closest('tr').data("row"));
		if (this.$tr.find('dd[name=model_id]').text() === ''){return;}
		this.$tr.find('button.btn-controls').toggleClass('hide');
		this.newRow();
	},

	removeRow: function(e){
		e.preventDefault(e);
		this.activeRow(this.$(e.target).closest('tr').data("row"));
		if(confirm('Esta seguro que desea elminar esta fila?')){
			this.$tr.remove();
		}
	},

	moreDetails: function(e){
		e.preventDefault(e);
		var options, rowId = this.$(e.target).closest('tr').data("row");
		this.activeRow(rowId);
		options = {
			rowId   : rowId,
			quantity: parseInt(this.$tr.find('input[name=quantity]').val()),
			details : this.details[rowId],
			model_id: this.$tr.find('dd[name=model_id]').text()
		};
		view = new App.Views.ApplianceMultipleFormDetailsModalView(options);
		app.modalController.displayModal(view, this, 'detailsUpdated');
	},

	detailsUpdated: function(id, details){
		this.details[id] = (this.details[id]) ? this.details[id] : {}; 
		this.details[id] = details;
		this.$tr.find('button[name=more-details]').removeClass('btn-success').addClass('btn-warning');
	},

	saveModel: function(){
		var self = this;
		this.$('tbody tr').each(function(index, tr){
			var $tr,rowId, quantity, options;
			$tr = self.$(tr).closest('tr');
			rowId    = $tr.data('row');
			quantity = parseInt($tr.find('input[name=quantity]').val());
			options   = {
				model_id        : $tr.find('dd[name=model_id]').text(),
				repairement_type: $tr.find('[name=repairement_type]').val(),
			};
			if(!options.model_id || options.model_id === ''){return;}
			for(var i = 0; i < quantity; i++){
				if (self.details[rowId] && self.details[rowId][i+1]){
					_.extend(options, self.details[rowId][i+1]);
				}
				options.client_id = self.collection.client_id;
				var model = new App.Models.Appliance(options);
				self.collection.add(model);
				model.trigger('change');
			}
		});
	},
});
App.Views.ApplianceShowView = App.Views.ShowView.extend({
	template : HBS.appliance_show_template,
	className: 'row',
	modelName: 'appliance',

	name: function(){
		return 'Equipo: #' + this.model.get('id');
	},

	bindings: {
		'[name=client_id]': {
			observe: 'client_id',
			onGet: function(id){
				try {
					var name = app.storage.get('clients', id).get('name'); 
					return '<a href="#render/client/show/'+id+'">'+name+'</a>';
				} catch (err) {
					return "";
				}
			},
			updateMethod: 'html'
		},
		'[name=service_request_id]': {
			observe: 'service_request_id',
			onGet: function(id){
				return '<a href="#render/service_request/show/'+id+'" class="btn btn-green pull-right" data-toggle="tooltip" data-placement="top" title="Orden de Servicio">' +
									'<i class="fa fa-clipboard fa-fw"></i> Ir a Orden de Servicio' +
								'</a>';
			},
			updateMethod: 'html'
		},
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

	awake: function(){
		this.listenTo(this.model, 'change:id'  , this.invokeSetHeader);
		this.listenTo(this      , 'disposing'  , function(){this.unstickit();});
	},

	afterRender: function(){
		this.stickit();
		this.renderForm();
	},

	renderForm: function(){
		if (!this.formView){
			this.formView = new App.Views.ApplianceEditFormView({
				model: this.model,
			});
			this.formView.attachTo(this.$('#form-' + this.cid), {method: 'html'});
		}
	},

	serialize: function(){
		var result = this.model.toJSON();
		result.cid = this.cid;
		return result;
	},

	onSync: function(){
		this.sync("model");
		if (this.model.model_id){this.model.model_id.fetch({merge: true});}
	},
});
App.Views.ApplianceSingleFormView = App.Views.BaseView.extend({
	template: HBS.appliance_single_form_template,

	className: 'col-lg-12',

	firstRender: true,

	events: {
		'submit form': function(e){e.preventDefault();},
	},

	initialize: function(){
		_.extend(this, App.Mixins.SelectModel);
		_.bindAll(this, 'selectModel', 'modelSelected', 'serialize', 'setAccessories', 'setModelDetails');
		this.$el.on('click', 'button#select-model', this.selectModel);
		this.listenTo(this      , 'disposing'              , this.selectModelOff);
		this.listenTo(this.model, 'change:id'              , function(){this.updateViewField.apply(this, ['id']);});
		this.listenTo(this.model, 'change:status'          , function(){this.updateViewField.apply(this, ['status']);});
		this.listenTo(this.model, 'change:serial'          , function(){this.updateViewField.apply(this, ['serial']);});
		this.listenTo(this.model, 'change:observations'    , function(){this.updateViewField.apply(this, ['observations']);});
		this.listenTo(this.model, 'change:repairement_type', function(){this.updateViewField.apply(this, ['repairement_type']);});
		this.listenTo(this.model, 'change:cost'            , function(){this.updateViewField.apply(this, ['cost']);});
		this.listenTo(this.model, 'change:defect'          , function(){this.updateViewText.apply(this, ['defect']);});
		this.listenTo(this.model, 'change:diagnose'        , function(){this.updateViewField.apply(this, ['diagnose']);});
		this.listenTo(this.model, 'change:replacements'    , function(){this.updateViewField.apply(this, ['replacements']);});
		this.listenTo(this.model, 'change:solution'        , function(){this.updateViewField.apply(this, ['solution']);});
		this.listenTo(this.model, 'change:accessories'     , this.setAccessories);
		this.listenTo(this.model, 'change:model_id'        , this.setModelDetails);
		this.listenTo(this, 'disposing', this.removeTagsinput);
	},

	afterRender: function(){
		this.tagsinput();
		this.$('[name=serial]').focus();
	},

	tagsinput: function(){
		var self = this;
		this.removeTagsinput();
		this.$('[name=accessories]').tagsinput();
		this.$('.bootstrap-tagsinput input').on("focus"   , function(e){ self.activateTags(e); });
		this.$('.bootstrap-tagsinput input').on("focusout", function(e){ self.deactivateTags(e); });
	},

	removeTagsinput: function(){
		this.$('.bootstrap-tagsinput input').off('focus');
		this.$('.bootstrap-tagsinput input').off('focusout');
		this.$('.bootstrap-tagsinput').remove();
	}, 

	saveAndDispose: function(){
		this.saveModel();
		this.dispose();
	},

	saveModel: function(){
		this.model.set(_.pick(this.$('form').formParams(),
			'serial',
			'observations',
			'repairement_type',
			'defect'
		));
		this.model.set('accessories', this.$('[name=accessories]').tagsinput('items'), {silent: true});
	},

	selectModelOff: function(){
		this.$el.off('click', 'button#select-model');
	},
});
App.Views.ClientRowView = App.Views.RowView.extend({
	template : HBS.client_row_template,
	modelName: 'client',
});
App.Views.ClientDetailsView = App.Views.ShowView.extend({
	template: HBS.client_details_template,

	className: 'row',

	bindings: {
		'[name=name]'      : 'name',
		'[name=doc-type]'  : 'doc-type',
		'[name=doc-number]': 'doc-number',
		'[name=phones]'    : {
			observe: 'phones',
			onGet  : function(values){
				if(!_.isArray(values)){return '<li>Vacío</li>';}
				var html = '';
				for(var i = 0;i < values.length;i++){
					html = html + '<li><i class="fa fa-phone fa-muted fa-fw"></i>'+values[i].number+'</li>';
				}
				return html;
			},
			updateMethod: 'html',
		},
		'[name=addresses]': {
			observe: 'addresses',
			onGet  : function(values){
				if(!_.isArray(values)){return '<li>Vacío</li>';}
				var html = '';
				for(var i = 0;i < values.length;i++){
					html = html + '<li><i class="fa fa-building-o fa-muted fa-fw"></i>'+
													values[i].street+'<br>'+
													values[i].city+','+values[i].city+
												'</li>';
				}
				return html;
			},
			updateMethod: 'html',
		},
		'[name=email]': "email",
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

	awake: function(){
		this.listenTo(this.model, 'change:name', this.invokeSetHeader);
		this.listenTo(this      , 'disposing'  , function(){this.unstickit();});
	},

	afterRender: function(){
		this.stickit();
	},

	// serialize: function(){
	//	var result       = (App.defined(this.model)) ? this.model.toJSON() : {};
	//	var createdAt    = this.model.get('createdAt');
	//	var updatedAt    = this.model.get('updatedAt');
	//	result.createdAt = this.model.dateDDMMYYYY(createdAt);
	//	result.updatedAt = this.model.dateDDMMYYYY(updatedAt);
	//	return result;
	// },
});
App.Views.ClientFormView = App.Views.BaseView.extend({
	template            : HBS.client_form_template,
	phoneFieldTemplate  : HBS.phone_field_template,
	addressFieldTemplate: HBS.address_field_template,

	className: 'col-md-12 col-lg-offset-1 col-lg-9',

	events: {
		'click #add-phone-number'        : 'addPhone',
		'click button.del-phone-number'  : 'delPhone',
		'click button.edit-phone-number' : 'editPhone',
		'click #add-address'             : 'addAddress',
		'click button.del-address'       : 'delAddress',
		'click button.edit-address'      : 'editAddress',
		'click #reset-form'              : 'resetForm',
		'click #update-form'             : 'updateModel',
		'click #edit-form'               : 'toggleButtons',
		'submit form'                    : 'createModel',
	},

	initialize: function(){
		this.bindEvents();
		this.cloneModelCollections();
	},

	cloneModelCollections: function(){
		if (!this.model){return;}
		var phones    = this.model.phones;
		var addresses = this.model.addresses;
		if(phones)   { this.phonesClone    = this.model.phones.clone(); }
		if(addresses){ this.addressesClone = this.model.addresses.clone(); }
	},

	bindEvents: function(){
		this.listenTo(this.model, 'change:phones'    , this.renderPhones);
		this.listenTo(this.model, 'change:addresses' , this.renderAddresses);
		this.listenTo(this.model, 'change:name'      , function(){this.updateViewField.apply(this, ['name']);});
		this.listenTo(this.model, 'change:doc-type'  , function(){this.updateViewField.apply(this, ['doc-type']);});
		this.listenTo(this.model, 'change:doc-number', function(){this.updateViewField.apply(this, ['doc-number']);});
		this.listenTo(this.model, 'change:email'     , function(){this.updateViewField.apply(this, ['email']);});
	},

	afterRender: function(){
		this.renderPhones();
		this.renderAddresses();
		if(!this.model.isNew()){this.blockForm();}
	},

	resetForm: function(e){
		e.preventDefault();
		if (this.model && this.model.phones && this.phonesClone){
			this.model.phones.reset(this.phonesClone.models);
		}
		if (this.model && this.model.addresses && this.addressesClone){
			this.model.addresses.reset(this.addressesClone.models);
		}
		this.render();
	},

	blockForm: function(){
		//App.Views.BaseView.prototype.blockForm.apply(this, arguments);
		this.$('.btn-success, .btn-danger, .btn-warning').hide();
		this.$('[name=name]'      ).attr("readonly", true);
		this.$('[name=doc-type]'  ).attr("readonly", true);
		this.$('[name=doc-number]').attr("readonly", true);
		this.$('[name=email]'     ).attr("readonly", true);
		this.$('[name=phone]'     ).hide();
		this.$('[name=street]'    ).hide();
		this.$('[name=city]'      ).hide();
		this.$('[name=department]').hide();
		this.$('[name=address-edit-row]').hide();
		this.$('.form-control-under label[for=address]').show();
		this.$('[data-source-index=0]').toggleClass('col-xs-offset-2');
	},

	unblockForm: function(){
		//App.Views.BaseView.prototype.unblockForm.apply(this, arguments);
		this.$('.btn-success, .btn-danger, .btn-warning').show();
		this.$('[name=name]'      ).attr("readonly", false);
		this.$('[name=doc-type]'  ).attr("readonly", false);
		this.$('[name=doc-number]').attr("readonly", false);
		this.$('[name=email]'     ).attr("readonly", false);
		this.$('[name=phone]'     ).show();
		this.$('[name=street]'    ).show();
		this.$('[name=city]'      ).show();
		this.$('[name=department]').show();
		this.$('[name=address-edit-row]').show();
		this.$('.form-control-under label[for=address]').hide();
		this.$('[data-source-index=0]').toggleClass('col-xs-offset-2');
	},

	toggleButtons: function(){
		if (this.$('#update-form').hasClass('hide')){
			this.unblockForm();
		} else {
			this.blockForm();
		}
		this.$('.update-buttons').toggleClass('hide');
	},

	renderPhones: function(){
		this.$('#phone-numbers').html(this.phoneFieldTemplate({
			phones : this.model.get('phones'),
		}));
		this.$('[name=phone]').focus();
	},

	addPhone: function(){
		var phones, number = this.$('[name=phone]').val();
		if(number === ""){return;}
		this.model.push('phones', {number: number});
	},

	delPhone:function(e){
		var index = (_.isObject(e)) ? 
			parseInt(this.$(e.currentTarget).closest('button').data('phoneIndex')) : e;
		this.model.pop('phones', index);
	},

	editPhone: function(e){
		var index = (_.isObject(e)) ? 
			parseInt(this.$(e.currentTarget).closest('button').data('phoneIndex')) : e;
		var phone = this.model.getAt('phones', index);
		this.delPhone(index);
		this.$('[name=phone]').val(phone.number);
	},

	renderAddresses: function(){
		this.$('#addresses').html(this.addressFieldTemplate({
			addresses : this.model.get('addresses'),
		}));
		this.$('[name=street]').focus();
		this.$('.form-control-under label[for=address]').hide();
	},

	addAddress: function(){
		var attrs = _.pick(this.$('form').formParams(), 'street', 'city', 'department');
		if(attrs.street === ""){return;}
		this.model.push('addresses', attrs);
	},

	delAddress: function(e){//
		var index = (_.isObject(e)) ? 
			parseInt(this.$(e.currentTarget).closest('button').data('sourceIndex')) : e;
		this.model.pop('addresses', index);
	},

	editAddress: function(e){
		var index = (_.isObject(e)) ? 
			parseInt(this.$(e.currentTarget).closest('button').data('sourceIndex')) : e;
		var address = this.model.getAt('addresses', index);
		this.delAddress(index);
		this.$('[name=street]'    ).val(address.street);
		this.$('[name=city]'      ).val(address.city);
		this.$('[name=department]').val(address.department);
	},

	setModel: function(){
		this.model.set(_.pick(this.$('form').formParams(), 'name', 'email', 'doc-type', 'doc-number'));
		if(this.$('[name=phone]').val()  !== ''){ this.addPhone(); }
		if(this.$('[name=street]').val() !== ''){ this.addAddress(); }
	},

	createModel: function(e){
		if (e){e.preventDefault();}
		var self = this;
		if(this.$('button[type=submit]').length === 0){return;}
		this.setModel();
		this.model.save(null, {
			success: function(model, response, options){
				self.invoke('showMessage', {
					title  : 'Cliente Creado',
					message: 'El nuevo cliente se ha creado con exito.',
					class  : 'success',
				});
			},
		});
		this.model = app.storage.newModel("clients");
		this.bindEvents();
		this.render();
		this.$('[name=name]').focus();
	},

	updateModel: function(e){
		if (e){e.preventDefault();}
		var self = this;
		this.setModel();
		this.toggleButtons();
		this.model.save(null, {
			success: function(model, response, options){
				self.invoke('showMessage', {
					title  : 'Datos Actualizados',
					message: 'El cliente se ha actualizado correctamente',
					class  : 'success',
				});
				model.set('updatedAt', new Date());
			},
		});
		this.cloneModelCollections();
	},

	dispose: function(){
		if (this.phonesClone)   { this.phonesClone.dispose(); }
		if (this.addressesClone){ this.addressesClone.dispose(); }
		Giraffe.dispose.apply(this, arguments);
	},

});
App.Views.ClientIndexView = App.Views.TableView.extend({
	template : HBS.client_index_template,
	className: "row",
	name     : "Clientes",
	
	tableEl        : '#clients-table',

	awake: function(){
		var self = this;
		fetchOptions = {
			data: {
				fields: '-service_requests'
			}
		};
		this.dataTableOptions = {
			"columnDefs": [
				{ "searchable": false, "targets": -1 },
				{ "className": "center-vh", "targets": -1 },
			],
			"columns": [
				{"data": function(source, type, val){
						if(type === "display"){
							return	'<ul class="list-unstyled">' +
												'<li><strong style="font-size: 16px">'+source.name+'</strong></li>' +
												'<li><strong>'+source["doc-type"]+'</strong> <i class="fa fa-barcode fa-fw"></i>'+source["doc-number"]+'</li>' +
												'<li><i class="fa fa-envelope fa-fw"></i>'+source.email+'</li>' +
											'</ul>';
						}
						return [source.name, source["doc-type"], source["doc-number"], source.email].join(" ");
					}
				},
				{"data": function(source, type, val){
						var phones = source.phones;
						if (!_.isArray(phones)){return phones;}
						if (type === "display"){
							var html = '<ul class="list-unstyled">';
							for (var i = 0; i < phones.length; i++){
								html = html + '<li><i class="fa fa-phone fa-muted fa-fw"></i>'+phones[i].number+'</li>';
							}
							html = html + '</ul>';
							return html;
						}
						return phones.join(' ');
					} 
				},
				{"data": function(source, type, val){
						var addresses = source.addresses;
						if (!_.isArray(addresses)){return addresses;}
						if (type === "display"){
							var html = '';
							for (var i = 0; i < addresses.length; i++){
								html = html + '<address><strong>'+addresses[i].street+'</strong>,<br>'+addresses[i].city+','+addresses[i].department+'</address>';
							}
							return html;
						}
						return addresses.join(' ');
					} 
				},
				{"data": function(source, type, val){
						if(type === "display"){
							var html;
							if (self.selection === true){
								html =	'<a data-id="'+source._id+'" class="btn btn-warning" name="select" data-toggle="tooltip" data-placement="top" title="Seleccionar">' +
													'<i class="fa fa-external-link fa-lg"></i>'+
												'</a>';
							} else {
								html =	'<a href="#render/client/show/'+ source._id +'" class="btn btn-green"  id="client-details" data-toggle="tooltip" data-placement="top" title="Mas Información">' +
													'<i class="fa fa-ellipsis-h fa-fw"></i>' +
												'</a>';
							}
							return html;
						}
						return source._id;
					}
				}
			]
		};
	},
});
App.Views.ClientNewView = App.Views.NewView.extend({	
	name        : "Nuevo Cliente",
	formViewName: "ClientFormView",
});
App.Views.ClientSelectModalView = App.Views.BaseView.extend({
	template: HBS.client_select_modal_template,
	
	name      : "ClientSelectModalView",
	
	modalOptions: {
		title     : "Seleccione un Cliente",
		footer    : false,
		modalClass: "modal-lg",
	},

	afterRender: function(){
		var self = this;
		this.clientIndex = new App.Views.ClientIndexView({
			collection: app.storage.getCollection("clients"),
			synced    : true,
			selection : true,
		});
		this.clientIndex.attachTo('#client-index');
	},
});
App.Views.ClientShowView = App.Views.TabView.extend({
	modelId     : null,
	modelName   : 'client',
	fetchOptions: {
		data: {
			fields: '-service_requests',
		}
	},

	name: function(){
		return 'Cliente: ' + this.model.get('name') + ' #' + this.model.get('id');
	},

	tabs: [
		{
			id    : 'details',
			title : 'Detalle',
			view  : 'ClientDetailsView',
			active: true,
		},
		{
			id            : 'service_requests',
			title         : 'Ordenes de Servicio',
			class         : 'air-t',
			renderFunction: function(){
				this.renderServiceRequests();
			},
		},
		{
			id   : 'edit',
			title: 'Editar Datos',
			class: 'air-t row',
			view : 'ClientFormView',
		}
	],

	renderServiceRequests: function(){
		if (!App.defined(this.serviceRequests)){
			var self = this;
			this.serviceRequests = new App.Views.ServiceRequestIndexView({
				collection: app.storage.getSubCollection("service_requests", {
					client_id: this.model.id,
				}, {
					success: function(){
						self.serviceRequests.attachTo(
							self.$('#client-service_requests-'+ self.timestamp), 
							{method: 'html'}
						);
					}
				}),
				synced: true,
			});
		} else {}
	},
});
App.Views.BreadCrumbsView = Giraffe.View.extend({
	template: HBS.breadcrumbs_template,
	className: 'row',
});
App.Views.AlertsLayoutView = Giraffe.View.extend({
	template: HBS.alerts_layout_template,
	tagName: 'li', 
	className: 'dropdown',
});
App.Views.BSCalloutView = App.Views.BaseView.extend({
	template: HBS.bs_callout_template,

	className: "bs-callout",

	lifetime: 4000,

	events: {
		'click .close': 'closeCallout',
		'click button': 'triggerEvent',
	},

	triggerEvent: function(e){
		var event = e.currentTarget.dataset.event;
		app.trigger(event);
	},

	afterRender: function(){
		var self      = this;
		var className = this.model.get('class');
		if(App.defined(className)){
			this.$el.addClass('bs-callout-' + className);
		}
		if(this.lifetime > 0){
			this.timer = setTimeout(function(){
				self.dispose();
			}, this.lifetime);
		}
		App.animate(this.$el, 'fadeInDown');
	},

	closeCallout: function(){
		if(App.defined(this.timer)){
			clearTimeout(this.timer);
		}
		this.dispose();
	},
});
App.Views.GoToTopView = App.Views.BaseView.extend({
	template: HBS.go_to_top_template,

	winH: 0,
	winW: 0,
	win: null,

	events: {
		'click': function(e){e.preventDefault(); App.scrollTo(0);},
	},

	initialize: function(){
		var self = this;
		this.win = $(window);
		this.win.scroll(function(){
			self.toggleViewOnOverflow();
		});
	},

	afterRender: function(){
		this.toggleViewOnOverflow();
		this.$el.tooltip();
	},

	windowHeight: function(){
		if( typeof( window.innerWidth ) == 'number' ) {
			//Non-IE
			this.winW = window.innerWidth;
			this.winH = window.innerHeight;
		} else if( document.documentElement && ( document.documentElement.clientWidth || document.documentElement.clientHeight ) ) {
			//IE 6+ in 'standards compliant mode'
			this.winW = document.documentElement.clientWidth;
			this.winH = document.documentElement.clientHeight;
		} else if( document.body && ( document.body.clientWidth || document.body.clientHeight ) ) {
			//IE 4 compatible
			this.winW = document.body.clientWidth;
			this.winH = document.body.clientHeight;
		}
	},

	toggleViewOnOverflow: function(){
		if(this.win.scrollTop() > 300){
			this.$el.fadeIn();
		} else {
			this.$el.fadeOut();
		}
	},
});
App.Views.MessagesLayoutView = Giraffe.View.extend({
	template: HBS.messages_layout_template,
	tagName: 'li', 
	className: 'dropdown',
});
App.Views.ModalController = App.Views.BaseView.extend({
	currentModal: null,
	callerView  : null,
	callerMethod: null,

	tagName     : 'section',
	id          : 'modal-el',
	
	events: {
		'click .close-modal': 'closeModal',
	},

	afterRender: function(){
		this.$modalContainer = this.$('#modalContainer');
	},

	displayModal: function(view, callerView, callerMethod, eventHandlerFn){
		if (callerView)   {this.callerView   = callerView;}
		if (callerMethod) {this.callerMethod = callerMethod;}
		if(!App.defined(this.currentModal) || this.currentModal.bodyView.cid !== view.cid){
			this.setCurrentModal(view);
		}
		this.$('#modalContainer').modal('show');
	},

	setCurrentModal: function(view){
		this.currentModal = new App.Views.ModalView({bodyView: view});
		this.attach(this.currentModal, {el: this.el, method: 'html'});
	},

	closeModal: function(){
		this.$('#modalContainer').modal('hide');
		this.callerView   = null;
		this.callerMethod = null;
	},

	runCallerMethod: function(){
		if(!App.defined(this.callerView) || !App.defined(this.callerMethod)){return;}
		var method = this.callerView[this.callerMethod];
		if(!_.isFunction(method)){return;}
		method.apply(this.callerView, arguments);
		this.closeModal();
	},
});
App.Views.NavView = Giraffe.View.extend({
	template: HBS.nav_template,
	tagName: 'nav',
	attributes: function(){
		return {
			'class': "navbar navbar-inverse navbar-fixed-top",
			'role': "navigation", 
			'style': "margin-bottom: 0" 
		};
	},

	initialize: function(){
		this.toggleSidebar = _.throttle(this.toggleSidebar, 600);
	},

	events: {
		'click #toggle-sidebar': 'toggleSidebar',
		'click .navbar-brand'  : 'toggleSidebar'
	},

	afterRender: function(){
		this.messagesLayout   = new App.Views.MessagesLayoutView();
		this.tasksLayout      = new App.Views.TasksLayoutView();
		this.alertsLayout     = new App.Views.AlertsLayoutView();
		this.userSettingsView = new App.Views.UserSettingsView();
		this.messagesLayout.attachTo('#nav-monitor-el');
		this.tasksLayout.attachTo('#nav-monitor-el');
		this.alertsLayout.attachTo('#nav-monitor-el');
		this.userSettingsView.attachTo('#nav-monitor-el');
	},

	toggleSidebar: function(e){
		e.preventDefault();
		var wrapper    = $('#page-wrapper');
		var whiteSpace = $('#white-space');
		var sidebar    = $('#sidebar-el');
		wrapper.toggleClass('make-space-right');
		whiteSpace.toggleClass('make-space-right');
		app.trigger('nav:toggleMenu:start');
		setTimeout(function(){
			app.trigger('nav:toggleMenu:end');
		}, 1000);
	},
});
App.Views.PortletView = App.Views.BaseView.extend({
	template: HBS.portlet_template,

	className: "row",

	view             : null,
	viewName         : null,
	portletFrameClass: null,
	flash            : null,
	entrance         : 'fadeInLeft',

	appEvents: {
		'portlet:message': 'message',
	},

	events: {
		'click #close'   : 'closeView',
		'click #sync'    : 'syncView',
		'click #collapse': 'collapseView',
	},

	afterRender: function(options){
		this.setFrame();
		this.setMainChildView();
		this.startTooltips();
		this.displayFlash();
		this.setHeader();
	},

	collapseView: function(){
		this.$('#collapse i').toggleClass('fa-chevron-uo').toggleClass('fa-chevron-down');
	},

	syncView: function(e){
		e.preventDefault();
		if (App.defined(this.view)){
			if(this.view.canSync()){
				this.$('#sync i').removeClass('fa-undo').addClass('fa-spinner fa-spin');
			} else {
				this.showMessage({
					title  : 'Atención',
					message: 'Esta ventana no se puede sincronizar',
					class  : 'warning',
				});
			}
		}
	},

	stopSpin: function(message){
		message = (message) ? message : {
			title  : 'Datos Actualizados',
			message: 'Los datos se han actualizado correctamente',
			class  : 'success',
		};
		if (this.$('#sync i').hasClass('fa-spinner')) {
			this.$('#sync i').removeClass('fa-spinner fa-spin').addClass('fa-undo');
		}
		this.showMessage(message);
	},

	displayFlash: function(){
		if (App.defined(this.flash)){
			this.showMessage(this.flash);
			this.flash = null;
		}
	},

	startTooltips: function(){
		App.animate(this.$el, this.entrance);
		this.$el.tooltip();
	},

	setMainChildView: function(){
		if(!App.defined(this.viewName)){return new Error('ViewName must be set');}
		if(!this.view){
				this.view = new App.Views[this.viewName]();
		}
		this.view.attachTo(this.$('#portlet-body'), {method: 'html'});
		this.listenTo(this.app, 'portlet:view: '+ this.view.cid +':sync:spin:stop', this.stopSpin);
	},

	setHeader: function(){
		this.$('#portlet-title-header').text(_.result(this.view, 'name'));
	},

	setFrame: function(){
		if(App.defined(this.portletFrameClass)){
			this.$('#portlet-frame').addClass('portlet-' + this.portletFrameClass);
		}
	},

	message: function(data){
		if (!App.defined(data) && !App.defined(data.viewCid)){
			return;
		}
		if (this.view.cid === data.viewCid){
			delete data.viewCid;
			this.showMessage(data);
		}
	},

	showMessage: function(data){
		var className = (data.class)   ? data.class   : 'success';
		var title     = (data.title)   ? data.title   : 'Exito';
		var message   = (data.message) ? data.message : '...'; 
		$.notify( {
			title  : title,
			message: message
		}, {
			style    : 'bs-callout',
			className: className,
		} );
	},

	serialize: function(){
		return {
			cid: this.cid,
		};
	},

	closePortletView: function(){
		this.dispose();
	},
});
App.Views.SearchView = App.Views.BaseView.extend({
	template: HBS.search_template,
	className: "input-group custom-search-form",
});
App.Views.SideNavView = App.Views.BaseView.extend({
	template: HBS.side_nav_template,

	show: true,

	tagName: 'nav',
	attributes: function(){
		return {
			'class': 'navbar-inverse navbar-static-side animated fadeInLeft',
			'role' : 'navigation',
		};
	},

	appEvents: {
		'nav:toggleMenu:start': 'toggleMenu',
	},

	events: {
		'click ul#side-menu li a'       : 'activateLi',
		'click ul.nav-second-level li a': 'activateSecondLi',
	},

	afterRender: function(){
    this.$('#side-menu').metisMenu();
    this.searchView = new App.Views.SearchView();
    this.searchView.attachTo('ul#side-menu li.sidebar-search');
	},

	activateLi: function(e){
		this.$('ul#side-menu li a').removeClass('active');
		this.$(e.currentTarget).closest('a').addClass('active');
	},

	activateSecondLi: function(e){
		this.$('ul.nav-second-level li a').removeClass('second-level-active');
		this.$(e.currentTarget).closest('a').addClass('second-level-active');
	},

	toggleMenu: function(){
		if(this.show){
			this.show = false;
			this.$el.removeClass('slideInLeft').addClass('slideOutLeft');
		} else {
			this.show = true;
			this.$el.removeClass('slideOutLeft').addClass('slideInLeft');
		}
	},
});
App.Views.TasksLayoutView = Giraffe.View.extend({
	template: HBS.tasks_layout_template,
	tagName: 'li', 
	className: 'dropdown',
});
App.Views.UserSettingsView = Giraffe.View.extend({
	template: HBS.user_settings_template,
	tagName: 'li', 
	className: 'dropdown',
});
App.Views.ModelRowView = App.Views.RowView.extend({
	template : HBS.model_row_template,
	modelName: 'model',
});
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
App.Views.ModelFormView = App.Views.FormView.extend({
	template: HBS.model_form_template,
	storage : 'models',
	focus   : '[name=brand]',

	createSuccessMessage: {
		title  : 'Modelo Creado',
		message: 'El nuevo modelo se ha creado con exito.',
		class  : 'success',
	},

	createErrorMessage: {
		title  : 'Error',
		message: 'Ha ocurrido un error. Por favor vuelva a intentar en unos minutos',
		class  : 'danger',
	},

	updateSuccessMessage: {
		title  : 'Modelo Actualizado',
		message: 'El modelo se ha actualizado con exito',
		class  : 'success',
	},

	updateErrorMessage: {
		title  : 'Error',
		message: 'Ha ocurrido un error. Por favor vuelva a intentar en unos minutos',
		class  : 'danger',
	},

	bindEvents: function(){
		this.listenTo(this.model, 'change:model'       , function(){this.updateViewField.apply(this, ['model']);});
		this.listenTo(this.model, 'change:brand'       , function(){this.updateViewField.apply(this, ['brand']);});
		this.listenTo(this.model, 'change:category'    , function(){this.updateViewField.apply(this, ['category']);});
		this.listenTo(this.model, 'change:subcategory' , function(){this.updateViewField.apply(this, ['subcategory']);});
	},
});
App.Views.ModelIndexView = App.Views.TableView.extend({
	template : HBS.model_index_template,
	className: "row",
	name     : "Modelos",
	
	tableEl        : '#models-table',

	awake: function(){
		var self = this;
		this.fetchOptions = {
			data: {
				fields: 'brand model category subcategory _id'
			}
		};
		this.dataTableOptions = {
			"columnDefs": [
				{ "searchable": false, "targets": -1 },
				{ "className": "center-vh", "targets": -1 },
			],
			"columns": [
				{"data": "model"},
				{"data": "brand"},
				{"data": "category"},
				{"data": "subcategory"},
				{"data": function(source, type, val){
						if(type === "display"){
							var html;
							if (self.selection === true){
								html =	'<a data-id="'+source._id+'" class="btn btn-warning btn-xs" name="select" data-toggle="tooltip" data-placement="top" title="Seleccionar">' +
													'<i class="fa fa-external-link fa-lg"></i>'+
												'</a>';
							} else {
								html =	'<a href="#render/model/show/'+ source._id +'" class="btn btn-green btn-xs"  id="client-details" data-toggle="tooltip" data-placement="top" title="Mas Información">' +
													'<i class="fa fa-ellipsis-h fa-fw"></i>' +
												'</a>';
							}
							return html;
						}
						return source._id;
					}
				}
			]
		};
	},
});
App.Views.ModelNewView = App.Views.NewView.extend({
	name        : "Nuevo Modelo",
	formViewName: "ModelFormView",
	modelName   : "Model",
});
App.Views.ModelSelectModalView = App.Views.BaseView.extend({
	template: HBS.model_select_modal_template,
	
	name      : "ModelSelectModalView",
	
	modalOptions: {
		title     : "Seleccione un Modelo",
		footer    : false,
		modalClass: "modal-lg",
	},

	afterRender: function(){
		this.modelIndex = new App.Views.ModelIndexView({
			collection: app.storage.getCollection("models"),
			synced    : true,
			selection : true,
		});
		this.modelIndex.parentView = this.parentView;
		this.modelIndex.attachTo('#model-index');
	},
});
App.Views.ModelShowView = App.Views.TabView.extend({
	name: function(){
		if (this.model){
			return 'Equipos con modelo ' + this.model.get('model');
		}
	},

	fetchOptions: {
		data: {
			fields: '-appliances',
		}
	},

	modelName: 'model',

	awake: function(){
		_.once(this.renderEditForm);
	},

	tabs: [
		{
			id    : 'details',
			title : 'Detalle',
			view  : 'ModelDetailsView',
			active: true,
		},
		{
			id            : 'edit',
			title         : 'Editar Datos',
			class         : 'air-t',
			renderFunction: function(){
				this.renderEditForm();
			},
		}
	],

	renderEditForm: function(){
		this.editForm = new App.Views.ModelFormView({
			model    : this.model,
			edit     : true,
			className: 'row',
		});
		this.editForm.attachTo(this.$('#model-edit-'+ this.timestamp), {method: 'html'});
	},

	bindEvents: function(){
		// Interacts with Row View to activate it
		this.listenTo(app, this.modelName + ':row:rendered', this.announceEntrance);
	},
});
App.Views.ServiceRequestRowView = App.Views.RowView.extend({
	template : HBS.service_request_row_template,
	modelName: "service_request",
	
	serialize: function(){
		var object = {};
		if (App.defined(this.model)){
			object = this.model.serialize();
			var createdAt = this.model.get('createdAt');
			var updatedAt = this.model.get('updatedAt');
			if (createdAt){ object.createdAt = this.model.dateDDMMYYYY(createdAt); }
			if (updatedAt){ object.updatedAt = this.model.dateDDMMYYYY(updatedAt); }
		}
		return object;
	},
});
App.Views.ServiceRequestDetailsView = App.Views.ShowView.extend({
	template: HBS.service_request_details_template,
	className: 'row',

	events: {
		'click #printPDF'          : 'print',
		'click #downloadPDF'       : 'download',
	},

	bindings: {
		'[name=client_id]': {
			observe: 'client_id',
			onGet: function(id){
				try {
					var name = app.storage.get('clients', id).get('name'); 
					return '<a href="#render/client/show/'+id+'">'+name+'</a>';
				} catch (err) {
					return "";
				}
			},
			updateMethod: 'html'
		},
		'[name=status]': 'status',
		'[name=invoiceNumber]': {
			observe: 'invoiceNumber',
			onGet  : function(value){
				if (!App.defined(value) || value === ''){return '';}
				return '<h3 class="pull-right">Remito: <span class="text-primary">'+value+'</span></h3>';
			},
			updateMethod: 'html'
		},
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

	awake: function(){
		this.listenTo(this.model, 'change:name', this.invokeSetHeader);
		this.listenTo(this      , 'disposing'  , function(){this.unstickit();});
	},

	afterRender: function(){
		this.stickit();
		this.renderApplianceIndex();
	},

	renderApplianceIndex: function(){
		if (!App.defined(this.model) || this.appliancesIndex){return;}
		var self = this;
		var el = this.$('#service-request-appliances');
		this.appliancesIndex = new App.Views.ApplianceIndexView({
			synced       : true,
			collection   : app.storage.getSubCollection("appliances", {
				service_request_id: this.model.id,
			}, {
				success: function(){
					self.appliancesIndex.attachTo(el, {method: 'html'});
					self.appliancesIndex.showReportButtons();
				}
			}),
		});
	},

	print: function(e){
		e.preventDefault();
		this.model.pdfReportPrint();
	},

	download: function(e){
		e.preventDefault();
		this.model.pdfReportDownload();
	},
});
App.Views.ServiceRequestFormView = App.Views.BaseView.extend({
	template     : HBS.service_request_form_template,
	formContainer: HBS.appliance_form_container,
	
	className: 'col-lg-12',

	events: {
		'click button#single-appliance'   : 'newSingleApplianceForm',
		'click button#multiple-appliances': 'newMultipleAppliancesForm',
		'click button.appliance-delete'   : 'deleteAppliance',
		'click button[type=submit]'       : 'createServiceRequest',
		'click button#select-client'      : 'selectClient',
	},

	initialize: function(){
		this.listenTo(this.model, 'change:client_name'  , function(){this.updateViewField.apply(this, ['client_name']);});
		this.listenTo(this.model, 'change:invoiceNumber', function(){this.updateViewField.apply(this, ['invoiceNumber']);});
		this.model.appliances = new App.Collections.Appliances();
		this.listenTo(this.model.appliances, 'change', this.setAppliances);
		this.listenTo(this.model.appliances, 'remove', this.setAppliances);
		this.listenTo(this, 'disposing', function(){
			this.model.appliances.dispose();
			this.model.appliances = undefined;
		});
	},

	setAppliances: function(){
		this.model.set('appliances', this.model.appliances.toJSON());
	},
	
	afterRender: function(){
		this.$el.tooltip();
		if (this.model && this.model.get('client_name') && this.model.get('client_id')){
			this.$('.btn-success').attr('disabled', false);
		}
	},

	serviceRequestSuccessFlash: {
		title   : 'Orden de Servicio Creada',
		message : 'La Orden de Servicio se ha creado con exito!.',
		class   : 'success',
	},

	zeroAppliancesFlash: {
		title  : 'Atención',
		message: 'Debe agregar por lo menos un equipo a la Orden de Servicio.',
		class  : 'warning',
	},

	selectClient: function(){
		if(!this.clientSelectModalView){
			this.clientSelectModalView = new App.Views.ClientSelectModalView();
		}
		app.modalController.displayModal(this.clientSelectModalView, this, 'clientSelected');
	},

	clientSelected: function(model){
		this.model.set('client_id'  , model.get('_id'));
		this.model.set('client_name', model.get('name'));
		this.$('.btn-success').attr('disabled', false);
	},

	newMultipleAppliancesForm: function(e){
		e.preventDefault();
		this.$('#multiple-appliances').hide();
		this.$('#single-appliance').hide();
		this.$('button[type=submit]').attr('disabled', false);
		this.appendMultipleAppliancesForm();
	},

	appendMultipleAppliancesForm: function(){
		this.model.appliances.client_id = this.model.get('client_id');
		this.multipleAppliancesForm = new App.Views.ApplianceMultipleFormView({
			collection: this.model.appliances,
		});
		this.multipleAppliancesForm.attachTo(this.$('#appliance-views'), {method: 'html'});
		App.scrollTo(this.multipleAppliancesForm.$el);
	},

	newSingleApplianceForm: function(e){
		e.preventDefault();
		this.$('#multiple-appliances').hide();
		var model = app.storage.newModel("appliances");
		model.set({
			client_name: this.model.get('client_name'),
			client_id  : this.model.get('client_id')
		});
		this.$('button[type=submit]').attr('disabled', false);
		this.model.appliances.add(model);
		this.appendApplianceForm(model);
	},

	appendApplianceForm: function(model, view){
		var appliances = this.model.appliances;
		if (model && !view){
			view = new App.Views.ApplianceSingleFormView({ model : model });
			view.listenTo(view.model, 'remove', function(){ view.dispose(); });
			this.addChild(view);
		} else if (!model && view) {
			model = view.model;
		}
		var index = appliances.indexOf(model);
		var style = (index % 2) ? 'background-color: #fff' : 'background-color: #E6E6E6';
		this.$('#appliance-views').append(this.formContainer({
			index: index,
			style: style
		}));
		view.attachTo(this.$('#appliance-container-'+index), {method: 'append'});
		if(index === (appliances.length - 1)){ App.scrollTo(view.$el, 50); }
	},

	deleteAppliance: function(e){
		e.preventDefault();
		var self       = this;
		var index      = e.currentTarget.dataset.index;
		var appliance  = this.model.appliances.at(index);
		appliance.dispose();
		this.$('#appliance-views').empty();
		_.each(this.children, function(view){
			self.appendApplianceForm(null, view);
			view.tagsinput();
		});
		if(this.model.appliances.length === 0){
			App.scrollTo(this.$el);
			this.$('#multiple-appliances').show();
			this.$('button[type=submit]').attr('disabled', true);
		}
	},

	createServiceRequest: function(e){
		e.preventDefault();
		var self = this;
		this.saveModel();
		_.each(this.children, function(child){
			child.saveModel();
		});
		if (this.model.appliances.length === 0){
			return this.invoke('showMessage', this.zeroAppliancesFlash);
		}
		this.model.save(null, {
			success: function(model, response, options){
				var route = 'service_request/show/' + model.id;
				Backbone.history.navigate(route);
				self.stopListening(model.appliances);
				app.Renderer.show({
					viewName         : 'ServiceRequestShowView',
					viewType         : 'show',
					model            : model,
					fetch            : false,
					portletFrameClass: 'green',
					flash            : self.serviceRequestSuccessFlash,
				});
				self.invoke('closePortletView');
			},
		});
	},

	saveModel: function(){
		this.model.set(_.pick(this.$('form').formParams(),
			'client_id',
			'client_name',
			'invoiceNumber'
		));
	},
});
App.Views.ServiceRequestIndexView = App.Views.TableView.extend({
	template      : HBS.service_request_index_template,
	className     : "row",
	name          : "Ordenes de Servicio",
	reportName    : function(model){return 'OdeS_' + model.get('id')+ '.pdf';},
	collectionName: "service_requests",
	
	tableEl  : '#service_requests-table',

	moreEvents:{
		'click button#new-service-request'      : 'newServiceRequest',
	},

	awake: function(){
		this.dataTableOptions = {
			"columnDefs": [
				{ "searchable": false, "targets": -1 },
				{ "className": "center-vh", "targets": -1 },
				{ "className": "text-center", "targets": [0, 2, 3, 4, 5, 6]},
				{ "width": "70px", "targets": -1},
			],
			"columns": [
				{"data": "id"             , "defaultContent": ""},
				{"data": "client_name"    , "defaultContent": ""},
				{"data": "invoiceNumber"  , "defaultContent": "S/R"},
				{"data": "appliancesCount", "defaultContent": "0"},
				{"data": "status"         , "defaultContent": ""},
				{"data": "createdAt_short", "defaultContent": ""},
				{"data": "closedAt_short" , "defaultContent": "Abierto"},
				{"data": this.serviceRequestButton, "defaultContent": ""}
			]
		};
	},

	serviceRequestButton: function(source, type, val){
		var model = app.storage.get('service_requests', source._id);
		if(type === "display"){ return model.showButton(); }
		return source._id;
	},

	comparator: function(portletView){
		return (
				portletView instanceof App.Views.PortletView &&
				portletView.viewName === "ServiceRequestNewView" &&
				App.defined(portletView.view) &&
				App.defined(portletView.view.model) &&
				portletView.view.model.get('client_id') === this.parent.model.id
			);
	},

	newServiceRequest: function(){
		if(!this.parent.model || !(this.parent.model instanceof App.Models.Client)){
			Backbone.history.navigate('render/service_request/new', {trigger: true});
			return;
		}
		var targetView = app.Renderer.viewIsRendered(this.comparator, this);
		if (targetView){
			return App.scrollTo(targetView.el);
		}
		var parentModel = this.parent.model;
		var object = {
			client_name: parentModel.get('name'),
			client_id  : parentModel.get('_id')
		};
		var model = new app.storage.newModel("service_requests").set(object);
		app.Renderer.show({
			viewName: 'ServiceRequestNewView',
			viewType: 'new',
			storage : "service_requests",
			model   : model
		});
	},
});
App.Views.ServiceRequestNewView = App.Views.NewView.extend({
	className: "row",
	formViewName: "ServiceRequestFormView",

	initialize: function(){
		this.listenTo(this.model, 'change:client_name', function(){ this.invoke('setHeader'); });
	},
	
	name: function(){
		var clientName, result = "Nueva Orden de Servicio";
		if (!this.model){return result;}
		clientName = this.model.get('client_name');
		if(App.defined(clientName)){
			return "Nueva Orden de Servicio para " + clientName;
		} else {
			return result;
		}
	},
});
App.Views.ServiceRequestShowView = App.Views.TabView.extend({
	events: {
		'click a': 'tryToslideToAppliance',
	},

	name     : function(){
		if (this.model){
			return 'Orden de Servicio #' + this.model.get('id');
		}
	},

	modelId  : null,
	modelName: 'service_request',

	tabs: [
		{
			id    : 'details',
			title : 'Detalle',
			view  : 'ServiceRequestDetailsView',
			active: true,
		},
		{
			id            : 'appliances',
			title         : 'Equipos',
			renderFunction: function(){
				this.renderAppliancesCarousel();
			},
		}
	],

	tryToslideToAppliance: function(e){
		var id, el = this.$(e.target).closest('a'); 
		if (el.attr('id') !== "appliance-details"){ return; }
		if (e) {e.preventDefault();}
		id = el.data('id');
		if (!this.appliancesCarousel){ return this.renderAppliancesCarousel(id); }
		this.slideToAppliance(id);
	},

	slideToAppliance: function(id){
		if (!this.appliancesCarousel){ return this.renderAppliancesCarousel(id); }
		var index =  this.getApplianceIndex(id);
		if (index === -1) { return; }
		this.$('#service_request-tabs li:eq(1) a').tab('show');
		this.appliancesCarousel.slideTo(index + 1);
		App.scrollTo(this.$('.tab-content'), 30);
	},

	getApplianceIndex: function(id){
		var index, model, view, collection;
		if (!this.appliancesCarousel){return -1;}
		view       = this.appliancesCarousel;
		collection = view.collection;
		model      = collection.get(id);
		if (!model){return -1;}
		index = collection.indexOf(model);
		return index;
	},

	bindEvents: function(){
		// Interacts with Row View to activate it
		this.listenTo(app, this.modelName + ':row:rendered', this.announceEntrance);
		this.listenTo(this.model, 'sync', function(){this.invoke('setHeader');});
	},

	renderAppliancesCarousel: function(id){
		if (!this.appliancesCarousel){
			if (!this.model){return;}
			var self = this;
			var el   = this.$('#' + this.modelName + '-appliances-' + this.timestamp);
			this.appliancesCarousel = new App.Views.ApplianceCarouselView({
				synced: true,
				collection : app.storage.getSubCollection('appliances', {
					service_request_id: this.model.id
				}, {
					success: function(){
						self.appliancesCarousel.attachTo(el, {method: 'html'});
						if (id) { self.slideToAppliance(id); }
					}
				})
			});
		}
	},

	onSync: function(){
		this.sync("model");
	},
});
App.Views.UserRowView = App.Views.RowView.extend({
	template : HBS.user_row_template,
	modelName: 'user',
});
App.Views.TechIndexView = App.Views.TableView.extend({
	template : HBS.tech_index_template,
	className: "row",
	name     : "Tecnicos",
	
	tableEl        : '#techs-table',
	modelView      : App.Views.UserRowView,

	awake: function(){
		this.fetchOptions = { data: { techs: true } };
		_.extend(this, App.Mixins.UserIndex);
		_.bindAll(this, 'userShowButton', 'userRoles', 'userData');		
	},
});
App.Views.UserDetailsView = App.Views.ShowView.extend({
	template: HBS.user_details_template,
	className: 'row',

	bindings: {
		'[name=name]': 'name',
		'[name=email]': 'email',
		'[name=permissions]': {
			observe: 'permissions',
			onGet: function(permissions){
				if (!permissions.roles || !_.isObject(permissions.roles) || _.keys(permissions.roles) === 0){return "";}
				var html = '';
				if (permissions.roles.isAdmin === true){html = html + '<li>Administrador</li>';}
				if (permissions.roles.isTech === true) {html = html + '<li>Tecnico</li>';}
				return html;
			},
			updateMethod: 'html'
		},
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

	awake: function(){
		this.listenTo(this.model, 'change:name'  , this.invokeSetHeader);
		this.listenTo(this      , 'disposing'    , function(){this.unstickit();});
	},

	afterRender: function(){
		this.stickit();
	},

	serialize: function(){
		var result = (App.defined(this.model)) ? this.model.toJSON() : {};
		result.timestamp = this.timestamp;
		return result;
	},
});
App.Views.UserFormView = App.Views.FormView.extend({
	template: HBS.user_form_template,
	storage : 'models',
	focus   : '[name=name]',

	initialize: function(){
		this.bindEvents();
	},

	bindEvents: function(){
		this.listenTo(this.model, 'change:name' , function(){this.updateViewField.apply(this, ['name']);});
		this.listenTo(this.model, 'change:email', function(){this.updateViewField.apply(this, ['email']);});
		this.listenTo(this.model, 'change:permissions', this.updateRoleField);
	},

	afterRender: function(){
		App.Views.FormView.prototype.afterRender.apply(this, arguments);
	},

	updateRoleField: function(role){
		var permissions = this.model.get("permissions");
		this.$('[name=isTech]' ).prop("checked", permissions.roles.isTech);
		this.$('[name=isAdmin]').prop("checked", permissions.roles.isAdmin);
		this.model.trigger("roles:change");
	},

	saveModel: function(){
		var attrs = _.pick(this.$('form').formParams(), 'name', 'email');
		attrs.permissions = this.getPermissions();
		this.model.set(attrs);
	},

	getPermissions: function(){
		return {
			roles: {
				isAdmin: this.$('[name=isAdmin]').is(':checked'),
				isTech : this.$('[name=isTech]').is(':checked'),
			}
		};
	},
});
App.Views.UserIndexView = App.Views.TableView.extend({
	template : HBS.user_index_template,
	className: "row",
	name     : "Usuarios",
	
	tableEl        : '#users-table',
	
	awake: function(){
		_.extend(this, App.Mixins.UserIndex);
		_.bindAll(this, 'userShowButton', 'userRoles', 'userData');
	},
});
App.Views.UserNewView = App.Views.NewView.extend({
	name        : "Nuevo Usuario",
	formViewName: "UserFormView",
	modelName   : "User",
});
App.Views.UserShowView = App.Views.TabView.extend({
	appliancesToolbar: HBS.appliances_toolbar,

	ui: {
		$formView : "#form-view",
		$tableView: "#table-view",
		$carousel : "#appliances-carousel",
		$table    : "#appliances-table",
	},

	events: {
		'click $tableView': 'changeView',
		'click $formView' : 'changeView',
		'click a'         : 'slideToAppliance',
	},

	name: function(){
		var permissions = this.model.get("permissions");
		if (permissions && permissions.roles && permissions.roles.isTech === true){
			return 'Tecnico: ' + this.model.get('name');
		}
		return 'Usuario: ' + this.model.get('name');
	},

	modelId  : null,
	modelName: 'user',

	awake: function(){
		this.listenTo(this.model, "change:permissions", this.techTab);
	},

	tabs: function(){
		var tabs = [
			{
				id    : 'details',
				title : 'Detalle',
				view  : 'UserDetailsView',
				active: true,
			},
			{
				id            : 'edit',
				title         : 'Editar Datos',
				class         : 'air-t',
				renderFunction: function(){
					this.renderEditForm();
				},
			}
		];
		var permissions = this.model.get("permissions");
		if (permissions && permissions.roles && permissions.roles.isTech === true){
			tabs.splice(1, 0, {
				id: 'appliances',
				title: 'Equipos',
				class : 'air-t',
				renderFunction: function(){
					this.renderAppliancesTable();
				},
			});
		}
		return tabs;
	},

	techTab: function(){
		var self = this;
		var tab  = this.$('#user-appliances');
		var permissions = this.model.get("permissions");
		if (!permissions || !permissions.roles)                       { return; }
		if (this.appliancesIndex && permissions.roles.isTech === true){ return; }
		if (permissions.roles.isTech === true && tab.length > 0)      { return; }
		if (permissions.roles.isTech === true && tab.length === 0){
			this.$('#user-edit').parent().before(
				'<li><a href="#user-appliances-'+this.timestamp+'" data-toggle="tab" id="user-appliances">Equipos</a></li>'
			);
			this.$('#user-edit-' + this.timestamp).before(
				'<div class="tab-pane fade in air-t" id="user-appliances-'+this.timestamp+'"></div>'
			);
			this.$('#user-appliances').on("click", function(e){
				self.$('#user-appliances').off("click");
				self.renderAppliancesTable();
			});
			return;
		}
		if (permissions.roles.isTech === false && tab){
			tab.parent().remove();
			if (this.appliancesIndex){ this.appliancesIndex.dispose(); this.appliancesIndex = undefined; }
			this.$('#user-appliances-'+this.timestamp).remove();
		}
	},

	changeView: function(e){
		if (e) {e.preventDefault();}
		this.$('[data-view=control]'  ).toggleClass('active');
		this.$('[data-view=control]'  ).toggleClass('btn-default-shadow');
		this.$('[data-view=control]'  ).toggleClass('btn-info');
		this.$('#appliances-table'   ).toggleClass('hide');
		this.$('#appliances-carousel').toggleClass('hide');
		this.renderAppliancesCarousel();
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
		App.scrollTo(this.$el, -70);
	},


	renderAppliancesTable: function(){
		if (!App.defined(this.model) || App.defined(this.appliancesIndex)){return;}
		var el         = this.$('#user-appliances-'+ this.timestamp);
		var collection = this.getAppliancesCollection();
		this.appliancesIndex = new App.Views.ApplianceIndexView({
			id        : "appliances-table",
			collection: collection,
		});
		this.appliancesIndex.attachTo(el, {method: 'html'});
		el.prepend(this.appliancesToolbar());
	},

	renderAppliancesCarousel: function(){
		if (!this.model) {return;}
		if (this.appliancesCarousel){return;}
		var el         = this.$('#appliances-carousel');
		var collection = this.getAppliancesCollection();
		this.appliancesCarousel = new App.Views.ApplianceCarouselView({
			collection: collection
		});
		this.appliancesCarousel.attachTo(el, { method: 'html' });
	},

	renderEditForm: function(){
		if(App.defined(this.editForm)){return;}
		this.editForm = new App.Views.UserFormView({
			model    : this.model,
			edit     : true,
			className: 'row',
		});
		this.editForm.attachTo(this.$('#user-edit-'+ this.timestamp), {method: 'html'});
	},

	getAppliancesCollection: function(){
		var self = this;
		if (!this.appliancesCollection){
			this.appliancesCollection = app.storage.getSubCollection(
				"appliances",
				{
					technician_id: this.model.id
				}, 
				{
					fetch: false,
					matches : function(attributes){
						try {if(attributes.technician_id === self.model.id){return true;}else{return false;}}
						catch (err){return false;}
					}
				}
			);
		}
		app.storage.collection('appliances').fetch({
			data: {
				technician_id: this.model.id
			}
		});
		return this.appliancesCollection;
	},
});
App.Routers.MainRouter = Giraffe.Router.extend({
	triggers: {
		'render/:doc/show/:id'                     : 'render:show',
		'render/:doc/:type'                        : 'render:doc',
		':doc/show/:id'                            : 'render:show',
		':doc/:type'                               : 'render:doc',
	},
});
App.GiraffeApp = Giraffe.App.extend({
	attributes: function(){
		return {
			'id': 'content-el',
		};
	},
});

var app = new App.GiraffeApp();

// Configure Ajax to use CSRF
app.addInitializer(function(){
	$.ajaxSetup({
		headers: {
			'X-CSRF-Token': csrf
		}
	});
});

// Build Nav
app.addInitializer(function(options){
	app.nav = new App.Views.NavView();
	app.nav.attachTo('#nav-el');
});

// Build SideNav
app.addInitializer(function(options){
	app.sideNav = new App.Views.SideNavView();
	app.sideNav.attachTo('#sidebar-el');
});

// Build Modal Controller View
app.addInitializer(function(){
	app.modalController = new App.Views.ModalController();
	app.modalController.attachTo('#wrapper');
});

// Build Scroller
app.addInitializer(function(options){
	app.GoToTopView = new App.Views.GoToTopView();
	app.GoToTopView.attachTo('#scroller-el');
});

// Setup Notify.js
app.addInitializer(function(options){
	$.notify.defaults({
		globalPosition: 'top right',
		showAnimation : 'fadeIn',
		hideAnimation : 'fadeOut',
		autoHideDelay : 1500,
		showDuration  : 200,
	});
	$.notify.addStyle('bs-callout', {
	html: 
		"<div>" +
			"<div class='clearfix'>" +
				"<h4 class='title' data-notify-text='title'></h4>" +
				"<p class='message' data-notify-text='message'></p>" +
			"</div>" +
		"</div>"
	});
});

// Add an easy access for the storage on the app object and populate some
// basic collections.
app.addInitializer(function(){
	app.storage = App.Storage.getInstance();
	app.storage.collection("models").add(models);
	app.storage.collection("clients").add(clients);
	app.storage.collection("users").add(techs);
	clients = undefined;
	models  = undefined;
	techs   = undefined;
});

// Start Backbone History, Renderer and main router
app.addInitializer(function(){
	app.Renderer   = new App.Views.Renderer();
	app.MainRouter = new App.Routers.MainRouter();
	Backbone.history.start();
});

$(document).ready(function(){
	moment.lang('es');
	app.attachTo('section#page-wrapper');
	app.start();
});