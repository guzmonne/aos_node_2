App.Views.BaseView = Giraffe.View.extend({
	canSync: function(){
		if (App.defined(this.onSync)){
			this.onSync();
			return true;
		} else {
			return false;
		}
	},

	afterSync: function(){
		app.trigger('portlet:view: '+ this.cid +':sync:spin:stop');
	},

	pluralize: function(value, target, singular, plural){
		var el = $(target);
		if (value > 1){
			el.text(plural);
		} else {
			el.text(singular);
		}
	},

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

	serialize: function(){
		if (App.defined(this.model)){
			return this.model.toJSON();
		}
	},

	capitaliseFirstLetter: function(string){
		return string.charAt(0).toUpperCase() + string.slice(1);
	},

	displayPortletMessage: function(options){
		var defaultOptions = {
			viewCid: this.parent.cid,
			title  : 'Titulo:',
			message: 'Cuerpo del mensaje',
		};
		var opts = typeof options !== 'undefined' ? options : defaultOptions; 
		app.trigger('portlet:message', opts);
	},

	blockForm: function(){
		this.$('input').attr('readonly', true);
		this.$('textarea').attr('readonly', true);
		this.$('select').attr('disabled', true);
		this.$('span[data-role=remove]').attr('data-role', 'not-remove');
	},

	unblockForm: function(){
		this.$('input').attr('readonly', false);
		this.$('textarea').attr('readonly', false);
		this.$('select').attr('disabled', false);
		this.$('span[data-role=not-remove]').attr('data-role', 'remove');
	},

	activateTags: function(e){
		if (!e){return;}
		this.$(e.currentTarget).closest('.bootstrap-tagsinput').addClass('active');
	},

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
});