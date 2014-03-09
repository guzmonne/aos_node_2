App.Models.BaseModel = Giraffe.Model.extend({
	getn: function(nestedAttrs){
		var attrs = nestedAttrs.split('.');
		var aux   = this.get(attrs[0]);
		_.each(attrs, function(attr, i){
			if (i !== 0){	
				aux = aux[attr];
			}
		});
		return aux;
	},

	setn: function(nestedAttrs, value){
		var self  = this;
		var attrs = nestedAttrs.split('.');
		var aux   = this.get(attrs[0]);
		_.each(attrs, function(attr, i){
			if (i === (attrs.length - 1)){
				aux[attr] = value;
				self.trigger('change:' + nestedAttrs);
			} else if (i !== 0){
				aux = aux[attr];
			}
		});
		return aux;
	},

	setp: function(attr, value){
		if (_.isArray(this.attributes[attr])){
			this.attributes[attr].push(value);
		} else {
			this.set(attr, value);
		}
	},

	popByEl: function(id, el, array){
		var self = this;
		_.each(array, function(element){
			if (element[el] === id){
				var index = array.indexOf(element);
				array.splice(index, 1);
			}
		});
	},
});