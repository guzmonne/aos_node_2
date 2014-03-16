App.Routers.MainRouter = Giraffe.Router.extend({
	triggers: {
		'render/:doc/:type': 'render:route',
		':doc/:type'       : 'render:route',
	},
});