App.Routers.MainRouter = Giraffe.Router.extend({
	triggers: {
		'render/:doc/show/:id'                     : 'render:show',
		'render/:doc/:type'                        : 'render:doc',
		':doc/show/:id'                            : 'render:show',
		':doc/:type'                               : 'render:doc',
	},
});