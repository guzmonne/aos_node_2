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

//{{#each tab}}
//<li {{#if active}}class="active"{{/if}}>
//	<a href="#{{href}}" data-toggle="tab" id="{{id}}">
//		{{title}}
//	</a>
//</li>
//{{/each}}

//{{#each tab}}
//  <div class="tab-pane fade in {{#if active}}active{{/if}} {{#if class}}{{class}}{{/if}}" id="{{href}}"></div>
//{{/each}}