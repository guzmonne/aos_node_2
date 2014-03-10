App.Views.ClientShowView = App.Views.BaseView.extend({
	template: HBS.client_show_template,

	className: 'row animated bounceIn',

	events: {
		'click #client-close' : 'closeView',
	},

	serialize: function(){
		var createdAt = this.model.get('createdAt');
		var updatedAt = this.model.get('updatedAt');
		this.model.set('createdAtShort', this.model.dateDDMMYYYY(createdAt));
		this.model.set('updatedAtShort', this.model.dateDDMMYYYY(updatedAt));
		return this.model.toJSON();
	},

	closeView: function(e){
		e.preventDefault();
		var self = this;
		this.$el.removeClass('bounceInRight').addClass('bounceOut');
		setTimeout(function(){
			self.dispose();
			app.trigger('client:show:close', self.model.cid);
		}, 800);
	},
});