App.Collections.Clients = App.Collections.BaseCollection.extend({
	model    : App.Models.Client,
	modelName: 'client',
});

App.Collections.Phones = App.Collections.BaseCollection.extend({
	model    : App.Models.Phone,
	modelName: 'phone',
});

App.Collections.Addresses = App.Collections.BaseCollection.extend({
	model    : App.Models.Address,
	modelName: 'address',
});