App.Routers.MainRouter = Giraffe.Router.extend({
	triggers: {
		'client/show/:id'                          : 'client:show',
		'client/index'                             : 'client:index',
		'client/new'                               : 'client:new',
		//'render/:doc/show/:id'                     : 'render:show',
		//'render/:doc/:type'                        : 'render:doc',
		//':doc/show/:id'                            : 'render:show',
		//':doc/:type'                               : 'render:doc',
	},
});