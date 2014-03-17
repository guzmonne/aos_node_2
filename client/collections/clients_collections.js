App.Collections.Clients = Giraffe.Collection.extend({
	url  : '/api/clients',
	model: App.Models.Client,
});

App.Collections.Phones = Giraffe.Collection.extend({
	model: App.Models.Phone,
});

App.Collections.Addresses = Giraffe.Collection.extend({
	model: App.Models.Address,
});