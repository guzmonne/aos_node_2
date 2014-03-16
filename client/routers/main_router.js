App.Routers.MainRouter = Giraffe.Router.extend({
	triggers: {
		':doc/index': 'route:doc:index',
		':doc/new'  : 'route:doc:new'
	},
});