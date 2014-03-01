window.App = {
  Models: {},
  Collections: {},
  Routers: {},
  Views: {},
  Regions: {},
  Mixins: {},
  Config: {},
  vent: _.extend({}, Backbone.Events),
  headerRegion: null,
  contentRegion: null,
  footerRegion: null,
  appDetails: null,
  session: null,
  user: null,
  awake: function() {
    this.appDetails = new App.Models.Application();
    this.session = new App.Models.Session();
    this.user = new App.Models.User();
    this.headerRegion = new App.Regions.HeaderRegion();
    this.contentRegion = new App.Regions.ContentRegion();
    this.footerRegion = new App.Regions.FooterRegion();
    return App.start();
  },
  start: function() {
    return this.session.getAuth(function(response) {
      new App.Routers.MainRouter();
      return Backbone.history.start();
    });
  },
  sseInit: function() {
    var _this = this;
    if (!!window.EventSource) {
      this.vent.source = new EventSource("/sse");
      this.vent.source.addEventListener('sse::connection', function(e) {
        return console.log(e);
      });
      this.vent.source.onmessage = function(event) {
        var data;
        data = JSON.parse(event.data);
        event = data.event;
        delete data.event;
        console.log(data);
        return _this.vent.trigger(event, data);
      };
      return this.vent.source.onerror = function(event) {
        switch (event.target.readyState) {
          case EventSource.CONNECTING:
            break;
          case EventSource.CLOSED:
            console.log("Connection failed. Will not retry.");
            break;
        }
      };
    } else {
      return console.log("EventSource not supported.");
    }
  }
};

$(document).ready(function() {
  return App.awake();
});

App.Config = (function() {
  function Config() {}

  Config.prototype.capitalize = function(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  Config.prototype.getParameters = function(route) {
    var normal, normals, optional, optionals, results, splat, splats, _i, _j, _k, _len, _len1, _len2;
    results = [];
    optionals = route.match(/\((.*?)\)/g);
    if (optionals != null) {
      for (_i = 0, _len = optionals.length; _i < _len; _i++) {
        optional = optionals[_i];
        route = route.replace("" + optional, "");
        results.push("" + (optional.replace(/\(\/:/, "").replace(/\)/, "")) + "=null");
      }
    }
    normals = route.match(/(\(\?)?:\w+/g);
    if (normals != null) {
      for (_j = 0, _len1 = normals.length; _j < _len1; _j++) {
        normal = normals[_j];
        results.push(normal.replace(/:/, ""));
      }
    }
    splats = route.match(/\*\w+/g);
    if (splats != null) {
      for (_k = 0, _len2 = splats.length; _k < _len2; _k++) {
        splat = splats[_k];
        results.push(splat.replace(/\*/, ""));
      }
    }
    return results;
  };

  Config.prototype.buildMethodFromRoute = function(routeAndMethodPair) {
    var object;
    object = {};
    object[_.values(routeAndMethodPair)[1]] = function() {
      return "Not yet implemented";
    };
    return object;
  };

  Config.prototype.buildRestRoutesMethods = function(restRoutes) {
    var pair, results, _i, _len, _ref;
    results = {};
    _ref = _.pairs(restRoutes);
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      pair = _ref[_i];
      _.extend(results, this.buildMethodFromRoute(pair));
    }
    return results;
  };

  Config.prototype.buildRestRoutes = function(strings) {
    var result;
    result = {};
    result[strings] = "" + strings + "Index";
    result[strings + "/new"] = "" + strings + "New";
    result[strings + "/:id"] = "" + strings + "Show";
    result[strings + "/:id/edit"] = "" + strings + "Edit";
    return result;
  };

  return Config;

})();

Handlebars.registerHelper("ParseDate", function (date) {
	var d = new Date(date);
  var day = d.getDate();
  var month = d.getMonth() + 1; //Months are zero based
  var year = d.getFullYear();
  var hours = d.getHours();
  var minutes = d.getMinutes();
  if (minutes < 10)
  	minutes = "0" + minutes;
  return (day + "/" + month + "/" + year + " " + hours + ":" + minutes);
});
Handlebars.registerHelper("Exists", function (attr, defaultValue) {
	if (attr)
		return attr;
	else
		return defaultValue;
});
this["HBS"] = this["HBS"] || {};

this["HBS"]["src/templates/app_nav.hbs"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<div class=\"container container-fluid\">\n	<div class=\"navbar-header\">\n		<button class=\"navbar-toggle\" type=\"button\" data-toggle=\"collapse\" data-target=\".navbar-collapse\">\n			<span class=\"sr-only\">\n				Toggle Navigation\n			</span>\n			<span class=\"icon-bar\"></span>\n			<span class=\"icon-bar\"></span>\n			<span class=\"icon-bar\"></span>\n		</button>\n		<a href=\"#\" class=\"navbar-brand\">AOS</a>\n	</div>\n	<div class=\"collapse navbar-collapse\">\n		<ul class=\"nav navbar-nav navbar-right\">\n			<li>\n				<a href=\"#\" class=\"dropdown-toggle\" data-toggle=\"dropdown\">\n					";
  if (stack1 = helpers.firstName) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.firstName); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + " ";
  if (stack1 = helpers.lastName) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.lastName); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + " \n					<b class='caret'></b>\n				</a>\n				<ul class=\"dropdown-menu\">\n					<li><a href=\"#profile\">Profile</a></li>\n					<li class=\"divider\"></li>\n					<li><a href=\"#logout\" id=\"nav-logout\">Logout</a></li>\n				</ul>\n			</li>\n		</ul>\n		<ul class=\"nav navbar-nav\">\n			<li>	\n				<a href=\"#\" class=\"dropdown-toggle\" data-toggle=\"dropdown\">\n					Usuarios\n					<b class='caret'></b>\n				</a>\n				<ul class=\"dropdown-menu\">\n					<li><a href=\"#users\">Lista</a></li>\n					<li><a href=\"#users/new\">Nuevo</a></li>\n				</ul>\n			</li>\n			<li class=\"nav-button\"> </li>\n		</ul>\n	</div>\n</div>";
  return buffer;
  });
this["HBS"] = this["HBS"] || {};

this["HBS"]["src/templates/snippets/badge.hbs"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<span id=\"";
  if (stack1 = helpers.id) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.id); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "\" class=\"badge\">";
  if (stack1 = helpers.value) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.value); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "</span>";
  return buffer;
  });
this["HBS"] = this["HBS"] || {};

this["HBS"]["src/templates/snippets/callout.hbs"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<div class=\"bs-callout bs-callout-";
  if (stack1 = helpers.alert) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.alert); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "\">\n	";
  if (stack1 = helpers.message) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.message); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "\n</div>";
  return buffer;
  });
this["HBS"] = this["HBS"] || {};

this["HBS"]["src/templates/content.hbs"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<div class=\"jumbotron\">\n	<h1>Welcome to my page!</h1>\n	<small>This is just a test</small>\n</div>";
  });
this["HBS"] = this["HBS"] || {};

this["HBS"]["src/templates/snippets/dismiss_alert.hbs"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, stack2, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, functionType="function";


  buffer += "<div class=\"alert alert-";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.Exists || (depth0 && depth0.Exists)),stack1 ? stack1.call(depth0, (depth0 && depth0.alert), "info", options) : helperMissing.call(depth0, "Exists", (depth0 && depth0.alert), "info", options)))
    + " alert-dismissable\">\n  <button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-hidden=\"true\">&times;</button>\n  ";
  if (stack2 = helpers.message) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = (depth0 && depth0.message); stack2 = typeof stack2 === functionType ? stack2.call(depth0, {hash:{},data:data}) : stack2; }
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n</div>";
  return buffer;
  });
this["HBS"] = this["HBS"] || {};

this["HBS"]["src/templates/footer.hbs"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<div class=\"container container-fluid navbar-inverse\" role='navigation'>\n	<p class=\"text-muted\">\n		";
  if (stack1 = helpers.footer) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.footer); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "\n	</p>\n</div>";
  return buffer;
  });
this["HBS"] = this["HBS"] || {};

this["HBS"]["src/templates/header.hbs"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<div class=\"container container-fluid\">\n	<div class=\"navbar-header\">\n		<button class=\"navbar-toggle\" type=\"button\" data-toggle=\"collapse\" data-target=\".navbar-collapse\">\n			<span class=\"sr-only\">\n				Toggle Navigation\n			</span>\n			<span class=\"icon-bar\"></span>\n			<span class=\"icon-bar\"></span>\n			<span class=\"icon-bar\"></span>\n		</button>\n		<a href=\"#\" class=\"navbar-brand\">";
  if (stack1 = helpers.title) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.title); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "</a>\n	</div>\n	<div class=\"collapse navbar-collapse\">\n		<ul class=\"nav navbar-nav\">\n			<li class=\"active nav-button\"> <a href=\"#login\" id=\"nav-login\">Login</a></li>\n		</ul>\n	</div>\n</div>";
  return buffer;
  });
this["HBS"] = this["HBS"] || {};

this["HBS"]["src/templates/login.hbs"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<div class=\"row vertical-offset-100\">\n	<div class=\"col-md-4 col-md-offset-4\">\n		<div class=\"panel panel-default\">\n			<div class=\"panel-heading\">\n				<h3 class=\"panel-title align-center\">Iniciar Sesión</h3>\n	 		</div>\n			<div class=\"panel-body\">\n				<form accept-charset=\"UTF-8\" role=\"form\">\n					<fieldset>\n						<div class=\"form-group\">\n							<input class=\"form-control\" placeholder=\"E-mail\" name=\"email\" type=\"text\">\n					</div>\n					<div class=\"form-group\">\n						<input class=\"form-control\" placeholder=\"Password\" name=\"password\" type=\"password\" value=\"\">\n					</div>\n					<hr>\n					<input class=\"btn btn-lg btn-success btn-block\" type=\"submit\" value=\"Login\">\n				</fieldset>\n					</form>\n			</div>\n	</div>\n</div>\n";
  });
this["HBS"] = this["HBS"] || {};

this["HBS"]["src/templates/test.hbs"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<h1>This is a test</h1>";
  });
this["HBS"] = this["HBS"] || {};

this["HBS"]["src/templates/users/users_div_row.hbs"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, stack2, options, functionType="function", escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing;


  buffer += "<div class=\"panel panel-primary\">\n    <div class=\"panel-heading\">\n        <h3 class=\"panel-title\">Detalle</h3>\n    </div>\n    <div class=\"panel-body\">\n        <div class=\"row\">\n            <div class=\"col-md-3 col-lg-3 hidden-xs hidden-sm\">\n                <img class=\"img-circle\"\n                     src=\"https://lh5.googleusercontent.com/-b0-k99FZlyE/AAAAAAAAAAI/AAAAAAAAAAA/eu7opA4byxI/photo.jpg?sz=100\"\n                     alt=\"User Pic\">\n            </div>\n            <div class=\"col-xs-2 col-sm-2 hidden-md hidden-lg\">\n                <img class=\"img-circle\"\n                     src=\"https://lh5.googleusercontent.com/-b0-k99FZlyE/AAAAAAAAAAI/AAAAAAAAAAA/eu7opA4byxI/photo.jpg?sz=50\"\n                     alt=\"User Pic\">\n            </div>\n            <div class=\"col-xs-10 col-sm-10 hidden-md hidden-lg\">\n                <strong>";
  if (stack1 = helpers.username) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.username); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "</strong><br>\n                <dl>\n                    <dt>Nombre Completo:</dt>\n                    <dd>";
  if (stack1 = helpers.firstname) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.firstname); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + " ";
  if (stack1 = helpers.lastname) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.lastname); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "</dd>\n                    <dt>Email:</dt>\n                    <dd>";
  if (stack1 = helpers.email) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.email); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "</dd>\n                    <dt>Perfil:</dt>\n                    <dd>";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.Exists || (depth0 && depth0.Exists)),stack1 ? stack1.call(depth0, (depth0 && depth0.role), "Administrador", options) : helperMissing.call(depth0, "Exists", (depth0 && depth0.role), "Administrador", options)))
    + "</dd>\n                    <dt>Creado:</dt>\n                    <dd>";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.ParseDate || (depth0 && depth0.ParseDate)),stack1 ? stack1.call(depth0, (depth0 && depth0.created), options) : helperMissing.call(depth0, "ParseDate", (depth0 && depth0.created), options)))
    + "</dd>\n                    <dt>Modificado:</dt>\n                    <dd>";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.ParseDate || (depth0 && depth0.ParseDate)),stack1 ? stack1.call(depth0, (depth0 && depth0.lastUpdated), options) : helperMissing.call(depth0, "ParseDate", (depth0 && depth0.lastUpdated), options)))
    + "</dd>\n                </dl>\n            </div>\n             <div class=\" col-md-9 col-lg-9 hidden-xs hidden-sm\">\n                <strong>";
  if (stack2 = helpers.username) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = (depth0 && depth0.username); stack2 = typeof stack2 === functionType ? stack2.call(depth0, {hash:{},data:data}) : stack2; }
  buffer += escapeExpression(stack2)
    + "</strong><br>\n                <table class=\"table table-user-information\">\n                    <tbody>\n                        <tr>\n                            <td>Nombre Completo</td>\n                            <td>";
  if (stack2 = helpers.firstname) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = (depth0 && depth0.firstname); stack2 = typeof stack2 === functionType ? stack2.call(depth0, {hash:{},data:data}) : stack2; }
  buffer += escapeExpression(stack2)
    + " ";
  if (stack2 = helpers.lastname) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = (depth0 && depth0.lastname); stack2 = typeof stack2 === functionType ? stack2.call(depth0, {hash:{},data:data}) : stack2; }
  buffer += escapeExpression(stack2)
    + "</td>\n                        </tr>\n                        <tr>\n                            <td>Email</td>\n                            <td>";
  if (stack2 = helpers.email) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = (depth0 && depth0.email); stack2 = typeof stack2 === functionType ? stack2.call(depth0, {hash:{},data:data}) : stack2; }
  buffer += escapeExpression(stack2)
    + "</td>\n                        </tr>\n                        <tr>\n                            <td>Perfil</td>\n                            <td>";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.Exists || (depth0 && depth0.Exists)),stack1 ? stack1.call(depth0, (depth0 && depth0.role), "Administrador", options) : helperMissing.call(depth0, "Exists", (depth0 && depth0.role), "Administrador", options)))
    + "</td>\n                        </tr>\n                        <tr>\n                            <td>Creado</td>\n                            <td>";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.ParseDate || (depth0 && depth0.ParseDate)),stack1 ? stack1.call(depth0, (depth0 && depth0.created), options) : helperMissing.call(depth0, "ParseDate", (depth0 && depth0.created), options)))
    + "</td>\n                        </tr>\n                        <tr>\n                            <td>Modificado</td>\n                            <td>";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.ParseDate || (depth0 && depth0.ParseDate)),stack1 ? stack1.call(depth0, (depth0 && depth0.lastUpdated), options) : helperMissing.call(depth0, "ParseDate", (depth0 && depth0.lastUpdated), options)))
    + "</td>\n                        </tr>\n                    </tbody>\n                </table>\n            </div>\n        </div>\n    </div>\n    <div class=\"panel-footer\">\n        <button class=\"btn btn-sm btn-primary\" type=\"button\"\n                data-toggle=\"tooltip\"\n                data-original-title=\"Enviar Mensaje\"><i class=\"glyphicon glyphicon-envelope\"></i></button>\n        <span class=\"pull-right\">\n            <button class=\"btn btn-sm btn-warning\" type=\"button\"\n                    data-toggle=\"tooltip\"\n                    data-original-title=\"Editar\"><i class=\"glyphicon glyphicon-edit\"></i></button>\n            <button class=\"btn btn-sm btn-danger\" type=\"button\"\n                    data-toggle=\"tooltip\"\n                    data-original-title=\"Eliminar\"><i class=\"glyphicon glyphicon-remove\"></i></button>\n        </span>\n    </div>\n</div>\n";
  return buffer;
  });
this["HBS"] = this["HBS"] || {};

this["HBS"]["src/templates/users/users_index.hbs"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<h1>Usuarios</h1>\n<hr>\n<div class=\"info\"></div>\n<div class=\"row btn-toolbar\">\n	<div class=\"col-lg-12\">\n	  <button type=\"button\" class=\"btn btn-primary dropdown-toggle\" data-toggle=\"dropdown\">\n	    Formato <span class=\"caret\"></span>\n	  </button>\n	  <ul class=\"dropdown-menu\" role=\"menu\">\n	    <li class=\"active pointer\" data-display=\"table\">\n	    	<a>\n	    		Tabla\n	    		<span class=\"glyphicon glyphicon-ok pull-right\" style=\"color: white\">\n	    	</a>\n	    </li>\n	    <li class=\"pointer\" data-display=\"block\">\n	    	<a>\n	    		Bloques\n	    	</a>\n	    </li>\n	  </ul>\n    <a class=\"btn btn-default\" href=\"#users/new\">Nuevo</a>\n	</div>\n</div>\n<br>	\n<div class=\"row\">\n	<div class=\"table-responsive col-lg-12\">\n		<table class=\"table table-hover table-striped\">\n			<thead>\n				<tr>\n					<th>Usuario</th>\n					<th>Nombre</th>\n					<th>Apellido</th>\n					<th>E-mail</th>\n					<th>Creado por</th>\n					<th>Creado el</th>\n					<th>Modificado el</th>\n					<th></th>\n					<th></th>\n				</tr>\n			</thead>\n			<tbody class=\"users\"></tbody>\n		</table>\n	</div>\n</div>\n<div class=\"row\">\n	<div class=\"col-lg-10 col-lg-offset-1\" id=\"usersBlock\"></div>\n</div>";
  });
this["HBS"] = this["HBS"] || {};

this["HBS"]["src/templates/users/users_new.hbs"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<h1>Nuevo Usuario</h1>\n<hr>\n<div class=\"row\">\n	<div class=\"col-md-10 col-md-offset-1\">\n		<div class=\"panel panel-default\">\n			<div class=\"panel-heading\">\n				<h3 class=\"panel-title align-center\">Nuevo Usuario</h3>\n	 		</div>\n			<div class=\"panel-body\">\n				<div class=\"btn-toolbar\">\n			  	<a class=\"btn btn-default\" href=\"#users\">Lista de Usuarios</a>\n				</div>\n				<hr>\n				<div class=\"info\"></div>\n				<form accept-charset=\"UTF-8\" role=\"form\">\n					<fieldset>\n						<div class=\"form-group\">\n							<label for=\"username\" class=\"control-label\">Usuario</label>\n							<input class=\"form-control\" placeholder=\"Usuario\" name=\"username\" type=\"text\">\n						</div>\n						<div class=\"form-group\">\n							<label for=\"firstname\" class=\"control-label\">Nombre</label>\n							<input class=\"form-control\" placeholder=\"Nombre\" name=\"firstname\" type=\"text\">\n						</div>\n						<div class=\"form-group\">\n							<label for=\"lastname\" class=\"control-label\">Apellido</label>\n							<input class=\"form-control\" placeholder=\"Apellido\" name=\"lastname\" type=\"text\">\n						</div>\n						<div class=\"form-group\">\n							<label for=\"email\" class=\"control-label\">E-mail</label>\n							<input class=\"form-control\" placeholder=\"E-mail\" name=\"email\" type=\"email\">\n						</div>\n						<div class=\"form-group\">\n							<label for=\"password\" class=\"control-label\">Password</label>\n							<input class=\"form-control\" placeholder=\"Password\" name=\"password\" type=\"password\" value=\"\">\n						</div>\n						<div class=\"form-group\">\n							<label for=\"password\" class=\"control-label\">Confirmar Password</label>\n							<input class=\"form-control\" placeholder=\"Confirmar Password\" name=\"confirm_password\" type=\"password\" value=\"\">\n						</div>\n						<hr>\n						<input class=\"btn btn-lg btn-success btn-block\" type=\"submit\" value=\"Crear Usuario\">\n					</fieldset>\n				</form>\n			</div>\n	</div>\n</div>\n";
  });
this["HBS"] = this["HBS"] || {};

this["HBS"]["src/templates/users/users_row.hbs"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, options, functionType="function", escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing;


  buffer += "<td>";
  if (stack1 = helpers.username) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.username); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "</td>\n<td>";
  if (stack1 = helpers.firstname) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.firstname); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "</td>\n<td>";
  if (stack1 = helpers.lastname) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.lastname); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "</td>\n<td>";
  if (stack1 = helpers.email) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.email); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "</td>\n<td>";
  if (stack1 = helpers.createdBy) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.createdBy); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "</td>\n<td>";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.ParseDate || (depth0 && depth0.ParseDate)),stack1 ? stack1.call(depth0, (depth0 && depth0.created), options) : helperMissing.call(depth0, "ParseDate", (depth0 && depth0.created), options)))
    + "</td>\n<td>";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.ParseDate || (depth0 && depth0.ParseDate)),stack1 ? stack1.call(depth0, (depth0 && depth0.lastUpdated), options) : helperMissing.call(depth0, "ParseDate", (depth0 && depth0.lastUpdated), options)))
    + "</td>\n<td>\n	<button class=\"btn btn-sm btn-warning\" type=\"button\"\n                    data-toggle=\"tooltip\"\n                    data-original-title=\"Editar\"><i class=\"glyphicon glyphicon-edit\"></i></button>\n</td>\n<td>\n	<button class=\"btn btn-sm btn-danger\" type=\"button\"\n                    data-toggle=\"tooltip\"\n                    data-original-title=\"Eliminar\"><i class=\"glyphicon glyphicon-remove\"></i></button>\n</td>";
  return buffer;
  });
this["HBS"] = this["HBS"] || {};

this["HBS"]["src/templates/users/users_simple_div_row.hbs"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, stack2, options, functionType="function", escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing;


  buffer += "<div class=\"col-xs-3 col-sm-2 col-md-1 col-lg-1\">\n    <img class=\"img-circle\"\n         src=\"https://lh5.googleusercontent.com/-b0-k99FZlyE/AAAAAAAAAAI/AAAAAAAAAAA/eu7opA4byxI/photo.jpg?sz=50\"\n         alt=\"User Pic\">\n</div>\n<div class=\"col-xs-8 col-sm-9 col-md-10 col-lg-10\">\n    <strong>";
  if (stack1 = helpers.username) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.username); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "</strong><br>\n    <span class=\"text-muted\">Perfil: ";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.Exists || (depth0 && depth0.Exists)),stack1 ? stack1.call(depth0, (depth0 && depth0.userlevel), "Administrator", options) : helperMissing.call(depth0, "Exists", (depth0 && depth0.userlevel), "Administrator", options)))
    + "</span>\n</div>\n<div class=\"col-xs-1 col-sm-1 col-md-1 col-lg-1 pointer\" data-for=\".";
  if (stack2 = helpers.username) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = (depth0 && depth0.username); stack2 = typeof stack2 === functionType ? stack2.call(depth0, {hash:{},data:data}) : stack2; }
  buffer += escapeExpression(stack2)
    + "\">\n    <i class=\"glyphicon glyphicon-chevron-down text-muted\"></i>\n</div>\n<div id=\"";
  if (stack2 = helpers._id) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = (depth0 && depth0._id); stack2 = typeof stack2 === functionType ? stack2.call(depth0, {hash:{},data:data}) : stack2; }
  buffer += escapeExpression(stack2)
    + "\"></div>";
  return buffer;
  });
var _ref, _ref1, _ref2, _ref3,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

App.Models.BaseModel = (function(_super) {
  __extends(BaseModel, _super);

  function BaseModel() {
    _ref = BaseModel.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  BaseModel.prototype.idAttribute = "_id";

  BaseModel.prototype.url = function() {
    var u;
    u = this.urlRoot;
    if (this.id) {
      u = u + ("/" + this.id);
    }
    return u;
  };

  BaseModel.prototype.validatePresenceOf = function(value) {
    if (value === null) {
      return false;
    }
    if (value && value.length) {
      return true;
    } else {
      return false;
    }
  };

  BaseModel.prototype.validateLengthOf = function(value, length, comp) {
    if (value === null) {
      return false;
    }
    switch (comp) {
      case "gt":
        if (value.length > length) {
          return true;
        } else {
          return false;
        }
        break;
      case "lt":
        if (value.length < length) {
          return true;
        } else {
          return false;
        }
    }
  };

  BaseModel.prototype.validateConfirmationOf = function(value, confirmValue) {
    if (value === confirmValue) {
      return true;
    } else {
      return false;
    }
  };

  BaseModel.prototype.validate = function(attrs, options) {
    var attrKey, attrVal, attributes, errors, val, valKey, valVal;
    if (attrs != null) {
      attributes = attrs;
    } else {
      attributes = this.attributes;
    }
    errors = [];
    for (attrKey in attributes) {
      attrVal = attributes[attrKey];
      if ((val = this.validations[attrKey])) {
        for (valKey in val) {
          valVal = val[valKey];
          switch (valKey) {
            case "presence":
              if (!this.validatePresenceOf(attrVal)) {
                errors.push({
                  attr: attrKey,
                  message: "este campo no puede permanecer vacío"
                });
              }
              break;
            case "lengthGT":
              if (!this.validateLengthOf(attrVal, valVal, 'gt')) {
                errors.push({
                  attr: attrKey,
                  message: "debe ingresar mas de " + valVal + " caracteres"
                });
              }
              break;
            case "lengthLT":
              if (!this.validateLengthOf(attrVal, valVal, 'lt')) {
                errors.push({
                  attr: attrKey,
                  message: "debe ingresar menos de " + valVal + " caracteres"
                });
              }
              break;
            case "confirm":
              if (!this.validateConfirmationOf(attrVal, this.attributes[valVal])) {
                errors.push({
                  attr: attrKey,
                  message: "los campos no coinciden"
                });
              }
          }
        }
      }
    }
    if (errors.length > 0) {
      return errors;
    }
  };

  return BaseModel;

})(Backbone.Model);

App.Models.Application = (function(_super) {
  __extends(Application, _super);

  function Application() {
    _ref1 = Application.__super__.constructor.apply(this, arguments);
    return _ref1;
  }

  Application.prototype.defaults = function() {
    return {
      title: 'AOS',
      description: 'Administrador de Ordenes de Servicio',
      author: 'Guzman Monne',
      footer: 'Base App - Guzman Monne - 2014 | Express + Backbone + Handlebars + Bootstrap '
    };
  };

  return Application;

})(Backbone.Model);

App.Models.Session = (function(_super) {
  __extends(Session, _super);

  function Session() {
    _ref2 = Session.__super__.constructor.apply(this, arguments);
    return _ref2;
  }

  Session.prototype.url = '/session';

  Session.prototype.initialize = function() {
    $.ajaxSetup({
      headers: {
        'X-CSRF-Token': csrf
      }
    });
    if (Storage && sessionStorage) {
      return this.supportStorage = true;
    }
  };

  Session.prototype.get = function(key) {
    var data;
    if (this.supportStorage) {
      data = sessionStorage.getItem(key);
      if (data && data[0] === '{') {
        return JSON.parse(data);
      } else {
        return data;
      }
    } else {
      return Backbone.Model.prototype.get.call(this, key);
    }
  };

  Session.prototype.set = function(key, value) {
    if (this.supportStorage) {
      sessionStorage.setItem(key, value);
    } else {
      Backbone.Model.prototype.set.call(this, key, value);
    }
    return this;
  };

  Session.prototype.unset = function(key) {
    if (this.supportStorage) {
      sessionStorage.removeItem(key);
    } else {
      Backbone.Model.prototype.unset.call(this, key);
    }
    return this;
  };

  Session.prototype.clear = function() {
    if (this.supportStorage) {
      return sessionStorage.clear();
    } else {
      return Backbone.Model.prototype.clear(this);
    }
  };

  Session.prototype.login = function(credentials) {
    var login,
      _this = this;
    login = $.ajax({
      url: "" + this.url + "/login",
      data: credentials,
      type: 'POST'
    });
    login.done(function(response) {
      var path;
      App.user.set(response);
      App.sseInit();
      _this.set("authenticated", true);
      _this.set("user", JSON.stringify(response.user));
      if (_this.get("redirectFrom")) {
        path = _this.get("redirectFrom");
        _this.unset("redirectFrom");
        return Backbone.history.navigate(path, {
          trigger: true
        });
      } else {
        return Backbone.history.navigate("", {
          trigger: true
        });
      }
    });
    return login.fail(function() {
      return Backbone.history.navigate("login", {
        trigger: true
      });
    });
  };

  Session.prototype.logout = function(callback) {
    var logout,
      _this = this;
    logout = $.ajax({
      url: "" + this.url + "/logout",
      type: 'DELETE'
    });
    return logout.done(function(response) {
      var csrf;
      _this.clear();
      App.vent.source.close();
      csrf = response.csrf;
      _this.initialize();
      return callback();
    });
  };

  Session.prototype.getAuth = function(callback) {
    var Session,
      _this = this;
    Session = this.fetch();
    Session.done(function(response) {
      _this.set("authenticated", true);
      App.user.set(response);
      return App.sseInit();
    });
    Session.fail(function(response) {
      var csrf;
      response = JSON.parse(response.responseText);
      _this.clear();
      if (response.csrf !== csrf) {
        csrf = response.csrf;
      } else {
        csrf = csrf;
      }
      return _this.initialize();
    });
    return Session.always(callback);
  };

  return Session;

})(Backbone.Model);

App.Models.User = (function(_super) {
  __extends(User, _super);

  function User() {
    _ref3 = User.__super__.constructor.apply(this, arguments);
    return _ref3;
  }

  User.prototype.urlRoot = '/api/users';

  User.prototype.defaults = {
    username: "",
    firstname: "",
    lastname: "",
    email: "",
    password: ""
  };

  User.prototype.validations = {
    username: {
      "presence": true,
      "lengthGT": 3,
      "lengthLT": 50
    },
    firstname: {
      "presence": true,
      "lengthLT": 50
    },
    lastname: {
      "presence": true,
      "lengthLT": 50
    },
    email: {
      "presence": true,
      "email": true
    },
    password: {
      "presence": true,
      "lengthGT": 7,
      "lengthLT": 20
    },
    confirm_password: {
      "confirm": "password"
    }
  };

  return User;

})(App.Models.BaseModel);

var _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

App.Collections.Users = (function(_super) {
  __extends(Users, _super);

  function Users() {
    _ref = Users.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  Users.prototype.model = App.Models.User;

  Users.prototype.url = '/api/users';

  return Users;

})(Backbone.Collection);

var _ref, _ref1, _ref2, _ref3,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

App.Regions.BaseRegion = (function(_super) {
  __extends(BaseRegion, _super);

  function BaseRegion() {
    _ref = BaseRegion.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  BaseRegion.prototype.container = null;

  BaseRegion.prototype.currentView = null;

  BaseRegion.prototype.initialize = function(options) {
    if (options == null) {
      options = {};
    }
    if (options.container != null) {
      this.container = options.container;
    }
    if (options.currentView != null) {
      this.currentView = options.currentView;
    }
    if (this.awake) {
      this.awake();
    }
    return this.innerViews = [];
  };

  BaseRegion.prototype.swapCurrentView = function(newView) {
    if (this.currentView) {
      this.currentView.close();
    }
    return this.currentView = newView;
  };

  BaseRegion.prototype.swapView = function(newView) {
    this.swapCurrentView(newView);
    return this.renderView();
  };

  BaseRegion.prototype.renderView = function(view, target) {
    var container;
    if (view == null) {
      view = void 0;
    }
    if (target == null) {
      target = void 0;
    }
    if (target != null) {
      container = target;
    } else {
      if (this.container) {
        container = this.container;
      } else {
        throw new Error('You must set the "container" property or pass a "target" value before calling this function');
      }
    }
    if (this.currentView == null) {
      if (view == null) {
        throw new Error('You must set the currentView or pass a new view to be rendered');
      }
      this.swapCurrentView(view);
    }
    if (view == null) {
      view = this.currentView;
    }
    $(container).append(view.render().el);
    return this;
  };

  return BaseRegion;

})(Backbone.View);

App.Regions.ContentRegion = (function(_super) {
  __extends(ContentRegion, _super);

  function ContentRegion() {
    _ref1 = ContentRegion.__super__.constructor.apply(this, arguments);
    return _ref1;
  }

  ContentRegion.prototype.container = '#content';

  return ContentRegion;

})(App.Regions.BaseRegion);

App.Regions.FooterRegion = (function(_super) {
  __extends(FooterRegion, _super);

  function FooterRegion() {
    _ref2 = FooterRegion.__super__.constructor.apply(this, arguments);
    return _ref2;
  }

  FooterRegion.prototype.container = 'footer';

  return FooterRegion;

})(App.Regions.BaseRegion);

App.Regions.HeaderRegion = (function(_super) {
  __extends(HeaderRegion, _super);

  function HeaderRegion() {
    _ref3 = HeaderRegion.__super__.constructor.apply(this, arguments);
    return _ref3;
  }

  HeaderRegion.prototype.container = 'header';

  return HeaderRegion;

})(App.Regions.BaseRegion);

var _ref, _ref1, _ref10, _ref2, _ref3, _ref4, _ref5, _ref6, _ref7, _ref8, _ref9,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  __slice = [].slice;

App.Views.BaseView = (function(_super) {
  __extends(BaseView, _super);

  function BaseView() {
    _ref = BaseView.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  BaseView.prototype.template = null;

  BaseView.prototype.dismissAlertTemplate = HBS['src/templates/snippets/dismiss_alert.hbs'];

  BaseView.prototype.badgeTemplate = HBS['src/templates/snippets/badge.hbs'];

  BaseView.prototype.calloutTemplate = HBS['src/templates/snippets/callout.hbs'];

  BaseView.prototype.render = function() {
    var model;
    if (_.isFunction(this.beforeRender)) {
      this.beforeRender();
    }
    if (this.model) {
      model = this.model.attributes;
    } else {
      model = {};
    }
    $(this.el).html(this.template(model));
    if (_.isFunction(this.afterRender)) {
      this.afterRender();
    }
    return this;
  };

  BaseView.prototype.renderIn = function(container) {
    var model;
    if (this.model) {
      model = this.model.attributes;
    } else {
      model = {};
    }
    $(container).html(this.template(model));
    return this;
  };

  BaseView.prototype.addInnerView = function(newView, target) {
    if (newView == null) {
      throw new Error('You must pass a new view to be rendered');
    }
    this.innerViews.push(newView);
    if (target != null) {
      return this.renderView(newView, target);
    } else {
      return this.renderView(newView);
    }
  };

  BaseView.prototype.close = function() {
    if (this.exitAnimation) {
      return this.animateExit();
    } else {
      return this.handleClose();
    }
  };

  BaseView.prototype.handleClose = function() {
    if (_.isFunction(this.beforeClose)) {
      this.beforeClose();
    }
    if (_.isFunction(this.onClose)) {
      this.onClose();
    }
    return this.remove();
  };

  BaseView.prototype.onClose = function() {
    var view, _i, _len, _ref1, _results;
    if (this.innerViews.length > 0) {
      _ref1 = this.innerViews;
      _results = [];
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        view = _ref1[_i];
        _results.push(view.close());
      }
      return _results;
    }
  };

  BaseView.prototype.dismissAlert = function(target, options) {
    var attrs;
    if (target == null) {
      return new Error('Yoy must pass a target for the alert');
    }
    if (options != null) {
      attrs = options;
    } else {
      attrs = {
        alert: "info",
        message: "<strong>HINT:</strong> You should pass an Object with a message."
      };
    }
    target = $(target);
    if ((options != null) && (options.fade != null) && options.fade) {
      return target.hide().html(this.dismissAlertTemplate(attrs)).fadeIn('slow');
    } else {
      return target.html(this.dismissAlertTemplate(attrs));
    }
  };

  BaseView.prototype.callout = function(target, options) {
    var attrs;
    if (target == null) {
      return new Error('Yoy must pass a target for the alert');
    }
    if (options != null) {
      attrs = options;
    } else {
      attrs = {
        alert: "info",
        message: "<strong>HINT:</strong> You should pass an Object with a message."
      };
    }
    target = $(target);
    if ((options != null) && (options.fade != null) && options.fade) {
      return target.hide().html(this.calloutTemplate(attrs)).fadeIn('slow');
    } else {
      return target.html(this.calloutTemplate(attrs));
    }
  };

  BaseView.prototype.badge = function(target, value, id) {
    if (id == null) {
      id = "";
    }
    if (target == null) {
      return new Error('Yoy must pass a target for the badge');
    }
    if (value == null) {
      return new Error('Yoy must pass a value for the badge');
    }
    target = $(target);
    return target.append(this.badgeTemplate({
      value: value,
      id: id
    })).hide().fadeIn('slow');
  };

  BaseView.prototype.handleValidations = function(model, errors) {
    var error, i, input, labels, message, _i, _len;
    this.$('.info').empty();
    this.$('p.control-label').remove();
    this.$('.has-error').removeClass('has-error');
    if (!((errors != null) && (model != null))) {
      return;
    }
    for (i = _i = 0, _len = errors.length; _i < _len; i = ++_i) {
      error = errors[i];
      input = this.$("[name=" + error.attr + "]");
      labels = $(".error-label-for-" + error.attr);
      message = '<p class="control-label error-label-for-' + error.attr + '"><span class="glyphicon glyphicon-remove"></span>' + "  " + error.message + '</p>';
      input.after(message);
      input.parent().addClass('has-error');
    }
    if (this.$('.has-error').length > 0) {
      return this.dismissAlert('.info', {
        alert: "danger",
        message: 'Verifique su información'
      });
    }
  };

  BaseView.prototype.propertyOrValue = function() {
    var element, targets;
    element = arguments[0], targets = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    if (targets.length === 1) {
      if (_.isObject(element)) {
        return element[targets[0]];
      } else {
        return element;
      }
    } else if (targets.length === 2) {
      if (_.isObject(element)) {
        return element[targets[0]][targets[1]];
      } else {
        return element;
      }
    } else {

    }
  };

  BaseView.prototype.animateExit = function() {
    var handleClose;
    handleClose = this.handleClose;
    $(this.el).addClass(this.animateExit);
    return setTimeout(_.bind(this, handleClose()), 500);
  };

  return BaseView;

})(App.Regions.BaseRegion);

App.Views.AppNav = (function(_super) {
  __extends(AppNav, _super);

  function AppNav() {
    _ref1 = AppNav.__super__.constructor.apply(this, arguments);
    return _ref1;
  }

  AppNav.prototype.name = "AppNav";

  AppNav.prototype.template = HBS['src/templates/app_nav.hbs'];

  AppNav.prototype.events = {
    'click ul.nav.navbar-nav li a': 'toggleActiveButton',
    'click .navbar-brand': 'removeActive'
  };

  AppNav.prototype.awake = function() {
    return this.listenTo(App.user, "change", this.render());
  };

  AppNav.prototype.removeActive = function() {
    return $('ul.nav.navbar-nav li.active').removeClass('active');
  };

  AppNav.prototype.toggleActiveButton = function(e) {
    var id;
    id = '#' + e.target.id;
    this.removeActive();
    return $(id).parent().addClass('active');
  };

  return AppNav;

})(App.Views.BaseView);

App.Views.ClientFooter = (function(_super) {
  __extends(ClientFooter, _super);

  function ClientFooter() {
    _ref2 = ClientFooter.__super__.constructor.apply(this, arguments);
    return _ref2;
  }

  ClientFooter.prototype.template = HBS['src/templates/footer.hbs'];

  return ClientFooter;

})(App.Views.BaseView);

App.Views.ClientNav = (function(_super) {
  __extends(ClientNav, _super);

  function ClientNav() {
    _ref3 = ClientNav.__super__.constructor.apply(this, arguments);
    return _ref3;
  }

  ClientNav.prototype.name = 'ClientNav';

  ClientNav.prototype.template = HBS['src/templates/header.hbs'];

  ClientNav.prototype.events = {
    'click ul.nav.navbar-nav li a': 'toggleActiveButton'
  };

  ClientNav.prototype.toggleActiveButton = function(e) {
    var id;
    id = '#' + e.target.id;
    $('ul.nav.navbar-nav li.active').removeClass('active');
    return $(id).parent().addClass('active');
  };

  return ClientNav;

})(App.Views.BaseView);

App.Views.ContentView = (function(_super) {
  __extends(ContentView, _super);

  function ContentView() {
    _ref4 = ContentView.__super__.constructor.apply(this, arguments);
    return _ref4;
  }

  ContentView.prototype.template = HBS['src/templates/content.hbs'];

  ContentView.prototype.awake = function() {
    return this.listenTo(App.vent, "sse:users:updated", function(data) {
      return $('h1').text(data.data);
    });
  };

  return ContentView;

})(App.Views.BaseView);

App.Views.Login = (function(_super) {
  __extends(Login, _super);

  function Login() {
    _ref5 = Login.__super__.constructor.apply(this, arguments);
    return _ref5;
  }

  Login.prototype.template = HBS['src/templates/login.hbs'];

  Login.prototype.events = {
    "submit form": "login"
  };

  Login.prototype.login = function(e) {
    var credentials;
    e.preventDefault();
    credentials = {
      email: $('[name=email]').val(),
      password: $('[name=password]').val()
    };
    return this.model.login(credentials);
  };

  Login.prototype.beforeRender = function() {
    return $('body').addClass('snowbg');
  };

  Login.prototype.beforeClose = function() {
    return $('body').removeClass('snowbg');
  };

  return Login;

})(App.Views.BaseView);

App.Views.UsersDivRow = (function(_super) {
  __extends(UsersDivRow, _super);

  function UsersDivRow() {
    _ref6 = UsersDivRow.__super__.constructor.apply(this, arguments);
    return _ref6;
  }

  UsersDivRow.prototype.template = HBS['src/templates/users/users_div_row.hbs'];

  UsersDivRow.prototype.tagName = 'div';

  UsersDivRow.prototype.className = "animated fadeInDown col-xs-12 col-sm-12 col-md-10 col-lg-10 col-xs-offset-0 col-sm-offset-0 col-md-offset-1 col-lg-offset-1";

  UsersDivRow.prototype.awake = function() {
    this.listenTo(this.model, "remove", this.close);
    return this.listenTo(App.vent, "users:index:render", this.close);
  };

  UsersDivRow.prototype.afterRender = function() {
    return this.$('[data-toggle="tooltip"]').tooltip();
  };

  return UsersDivRow;

})(App.Views.BaseView);

App.Views.UsersIndex = (function(_super) {
  __extends(UsersIndex, _super);

  function UsersIndex() {
    _ref7 = UsersIndex.__super__.constructor.apply(this, arguments);
    return _ref7;
  }

  UsersIndex.prototype.template = HBS['src/templates/users/users_index.hbs'];

  UsersIndex.prototype.container = 'tbody.users';

  UsersIndex.prototype.untrackedUsers = 0;

  UsersIndex.prototype.usersView = 'table';

  UsersIndex.prototype.glyphOK = "glyphicon glyphicon-ok pull-right";

  UsersIndex.prototype.display = "table";

  UsersIndex.prototype.events = {
    "click ul.dropdown-menu li": "changeDisplay"
  };

  UsersIndex.prototype.awake = function() {
    this.collection.fetch();
    this.listenTo(this.collection, "add", this.appendView);
    this.listenTo(this.collection, "remove", this.removeView);
    return this.listenTo(App.vent, "users:new", this.sseUsersNew);
  };

  UsersIndex.prototype.sseUsersNew = function(message) {
    this.untrackedUsers++;
    this.$('.info').empty();
    return this.dismissAlert(".info", {
      message: "" + (this.untrackedUsers === 1 ? "Se ha creado un nuevo usuario" : "Se han creado " + this.untrackedUsers + " nuevos usuarios") + "				<button id='resync' type='button' class='btn btn-info'>Sincronizar</button>				"
    });
  };

  UsersIndex.prototype.handleSync = function() {
    this.untrackedUsers = 0;
    return this.appendCollection();
  };

  UsersIndex.prototype.appendCollection = function() {
    var _this = this;
    App.vent.trigger("users:index:render");
    return this.collection.forEach(function(model) {
      return _this.appendView(model);
    });
  };

  UsersIndex.prototype.appendView = function(model) {
    var row_view, simple_div_view;
    if (this.display === "table") {
      this.$('.table-responsive').show();
      row_view = new App.Views.UsersRow({
        model: model
      });
      return this.addInnerView(row_view);
    } else {
      this.$('.table-responsive').hide();
      simple_div_view = new App.Views.UsersSimpleDivRow({
        model: model
      });
      return this.addInnerView(simple_div_view, '#usersBlock');
    }
  };

  UsersIndex.prototype.changeDisplay = function(e) {
    this.display = e.currentTarget.dataset.display;
    this.$('ul.dropdown-menu li').removeClass('active');
    this.$('li span').remove();
    this.$(e.currentTarget).addClass('active');
    this.$(e.target).append("<span class='" + this.glyphOK + "' style='color: white'></span>");
    return this.appendCollection();
  };

  return UsersIndex;

})(App.Views.BaseView);

App.Views.UsersNew = (function(_super) {
  __extends(UsersNew, _super);

  function UsersNew() {
    _ref8 = UsersNew.__super__.constructor.apply(this, arguments);
    return _ref8;
  }

  UsersNew.prototype.template = HBS['src/templates/users/users_new.hbs'];

  UsersNew.prototype.events = {
    "submit form": "create",
    "focusout input": "validateField"
  };

  UsersNew.prototype.awake = function() {
    this.listenTo(this.model, "sync", this.handleSuccess);
    this.listenTo(this.model, "error", this.handleError);
    this.listenTo(this.model, "invalid", this.handleValidations);
    return this.modelBinder = new Backbone.ModelBinder();
  };

  UsersNew.prototype.afterRender = function() {
    return this.modelBinder.bind(this.model, this.$el);
  };

  UsersNew.prototype.beforeClose = function() {
    return this.modelBinder.unbind();
  };

  UsersNew.prototype.create = function(e) {
    e.preventDefault();
    return this.model.save();
  };

  UsersNew.prototype.validateField = function(e) {
    var error, object, targetName;
    targetName = this.propertyOrValue(e, "target", "name");
    object = {};
    object[targetName] = this.model.attributes[targetName];
    error = this.model.validate(object);
    return this.handleValidations(this.model, error);
  };

  UsersNew.prototype.toggleLabel = function(e) {
    var targetName;
    if (_.isObject(e)) {
      targetName = e.target.name;
    } else if (_.isString(e)) {
      targetName = e;
    }
    if (this.$("input[name=" + targetName + "]").val() === "") {
      return this.$("[for=" + targetName + "]").fadeToggle('fast');
    }
  };

  UsersNew.prototype.handleSuccess = function(model, response, options) {
    this.model = new App.Models.User();
    this.render();
    this.dismissAlert('.info', {
      fade: true,
      alert: 'success',
      message: 'El usuario ha sido creado con exito.'
    });
    return this.$('[name=username]').focus();
  };

  UsersNew.prototype.handleError = function(model, xhr, options) {
    this.handleValidations();
    if (xhr.status === 400) {
      return this.dismissAlert('.info', {
        alert: 'danger',
        message: 'Ya existe el usuario.'
      });
    } else {
      return this.dismissAlert('.info', {
        alert: 'danger',
        message: 'Se ha producido un error al intentar crear el usuario.'
      });
    }
  };

  return UsersNew;

})(App.Views.BaseView);

App.Views.UsersRow = (function(_super) {
  __extends(UsersRow, _super);

  function UsersRow() {
    _ref9 = UsersRow.__super__.constructor.apply(this, arguments);
    return _ref9;
  }

  UsersRow.prototype.template = HBS['src/templates/users/users_row.hbs'];

  UsersRow.prototype.tagName = 'tr';

  UsersRow.prototype.className = 'animated fadeIn';

  UsersRow.prototype.awake = function() {
    this.listenTo(this.model, "remove", this.close);
    return this.listenTo(App.vent, "users:index:render", this.close);
  };

  UsersRow.prototype.afterRender = function() {
    return this.$('[data-toggle="tooltip"]').tooltip();
  };

  return UsersRow;

})(App.Views.BaseView);

App.Views.UsersSimpleDivRow = (function(_super) {
  __extends(UsersSimpleDivRow, _super);

  function UsersSimpleDivRow() {
    _ref10 = UsersSimpleDivRow.__super__.constructor.apply(this, arguments);
    return _ref10;
  }

  UsersSimpleDivRow.prototype.template = HBS['src/templates/users/users_simple_div_row.hbs'];

  UsersSimpleDivRow.prototype.tagName = 'div';

  UsersSimpleDivRow.prototype.className = 'animated fadeInLeft well row user-row';

  UsersSimpleDivRow.prototype.details = false;

  UsersSimpleDivRow.prototype.exitAnimation = "fadeOutRight";

  UsersSimpleDivRow.prototype.awake = function() {
    this.listenTo(this.model, "remove", this.close);
    return this.listenTo(App.vent, "users:index:render", this.close);
  };

  UsersSimpleDivRow.prototype.events = {
    "click .pointer": "toggleDetails"
  };

  UsersSimpleDivRow.prototype.toggleDetails = function() {
    var div_view;
    this.$('.pointer i').toggleClass('glyphicon-chevron-down').toggleClass('glyphicon-chevron-up');
    if (this.details) {
      return this.$("#" + (this.model.get('_id')) + " div").toggle();
    } else {
      this.details = true;
      div_view = new App.Views.UsersDivRow({
        model: this.model
      });
      return this.addInnerView(div_view, "#" + (this.model.get('_id')));
    }
  };

  return UsersSimpleDivRow;

})(App.Views.BaseView);

var _ref, _ref1,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

App.Routers.BaseRouter = (function(_super) {
  __extends(BaseRouter, _super);

  function BaseRouter() {
    _ref = BaseRouter.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  BaseRouter.prototype.before = function() {};

  BaseRouter.prototype.after = function() {};

  BaseRouter.prototype.route = function(route, name, callback) {
    var router,
      _this = this;
    if (!_.isRegExp(route)) {
      route = this._routeToRegExp(route);
    }
    if (_.isFunction(name)) {
      callback = name;
      name = "";
    }
    if (!callback) {
      callback = this[name];
    }
    router = this;
    return Backbone.history.route(route, function(fragment) {
      var args, next;
      args = router._extractParameters(route, fragment);
      next = function() {
        callback && callback.apply(router, args);
        router.trigger.apply(router, ["route:" + name].concat(args));
        router.trigger("route", name, args);
        Backbone.history.trigger("route", router, name, args);
        return router.after.apply(router, args);
      };
      return router.before.apply(router, [args, next]);
    });
  };

  return BaseRouter;

})(Backbone.Router);

App.Routers.MainRouter = (function(_super) {
  __extends(MainRouter, _super);

  function MainRouter() {
    _ref1 = MainRouter.__super__.constructor.apply(this, arguments);
    return _ref1;
  }

  MainRouter.prototype.routes = {
    'login': 'login',
    'logout': 'logout',
    'users/new': 'usersNew',
    'users': 'usersIndex',
    'home': 'index',
    '': 'index',
    '*path': 'default'
  };

  MainRouter.prototype.requiresAuth = ['', '#home', '#logout', '#users/new', '#users'];

  MainRouter.prototype.preventAccessWhenAuth = ["#login"];

  MainRouter.prototype.before = function(params, next) {
    var cancelAccess, isAuth, needAuth, path;
    isAuth = App.session.get('authenticated');
    path = Backbone.history.location.hash;
    needAuth = _.contains(this.requiresAuth, path);
    cancelAccess = _.contains(this.preventAccessWhenAuth, path);
    if (needAuth && !isAuth) {
      App.session.set("redirectFrom", path);
      return Backbone.history.navigate('login', {
        trigger: true
      });
    } else if (isAuth && cancelAccess) {
      return Backbone.history.navigate('', {
        trigger: true
      });
    } else {
      return next();
    }
  };

  MainRouter.prototype.after = function(params) {
    this.setHeader();
    return this.setFooter();
  };

  MainRouter.prototype.setHeader = function() {
    var header, headerView;
    headerView = App.headerRegion.currentView;
    if (App.session.get("authenticated")) {
      if (((headerView != null) && headerView.name === "ClientNav") || (headerView == null)) {
        header = new App.Views.AppNav({
          model: App.user
        });
      }
    } else {
      if (((headerView != null) && headerView.name === "AppNav") || (headerView == null)) {
        header = new App.Views.ClientNav({
          model: App.appDetails
        });
      }
    }
    if (header != null) {
      return App.headerRegion.swapView(header);
    }
  };

  MainRouter.prototype.setFooter = function() {
    var footer;
    if (App.footerRegion.currentView == null) {
      footer = new App.Views.ClientFooter({
        model: App.appDetails
      });
    }
    if (footer != null) {
      return App.footerRegion.swapView(footer);
    }
  };

  MainRouter.prototype.fetchError = function(error) {
    if (error.status === 401) {
      return App.session.getAuth(function() {
        return Backbone.history.navigate('login', {
          trigger: true
        });
      });
    }
  };

  MainRouter.prototype.index = function() {
    return App.contentRegion.swapView(new App.Views.ContentView({
      model: App.user
    }));
  };

  MainRouter.prototype["default"] = function() {
    return Backbone.history.navigate('', {
      trigger: true
    });
  };

  MainRouter.prototype.login = function() {
    App.headerRegion.swapView(new App.Views.ClientNav({
      model: App.appDetails
    }));
    return App.contentRegion.swapView(new App.Views.Login({
      model: App.session
    }));
  };

  MainRouter.prototype.logout = function(e) {
    return App.session.logout(function() {
      return Backbone.history.navigate('#login', {
        trigger: true
      });
    });
  };

  MainRouter.prototype.usersNew = function() {
    return App.contentRegion.swapView(new App.Views.UsersNew({
      model: new App.Models.User()
    }));
  };

  MainRouter.prototype.usersIndex = function() {
    return App.contentRegion.swapView(new App.Views.UsersIndex({
      collection: new App.Collections.Users()
    }));
  };

  return MainRouter;

})(App.Routers.BaseRouter);
