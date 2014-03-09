this["HBS"] = this["HBS"] || {};this["HBS"]["address_field_template"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<div class=\"row\" style=\"margin: 0\" data-address-id=\"";
  if (stack1 = helpers.timestamp) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.timestamp); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "\">\n	<hr>\n	<div class=\"col-sm-2 form-control-under\">\n		<button type=\"button\" class=\"btn btn-danger pull-right del-address\" tabindex = \"-1\">\n			<i class=\"fa fa-minus\"></i>\n		</button>\n	</div>\n	<div class=\"col-sm-8 form-control-under\">\n		<input type=\"text\" class=\"form-control\" value=\"";
  if (stack1 = helpers.street) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.street); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "\">\n	</div>\n	<label for=\"street\" class=\"col-sm-2 text-muted control-label-under\" style=\"text-align: left; margin-bottom: 8px\">\n		Calle\n	</label>\n	<div class=\"col-sm-8 col-sm-offset-2\">\n		<input type=\"text\" class=\"form-control form-control-under\" value=\"";
  if (stack1 = helpers.city) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.city); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "\">\n	</div>\n	<label for=\"city\" class=\"col-sm-2 text-muted control-label-under\">\n		Ciudad\n	</label>\n	<div class=\"col-sm-8 col-sm-offset-2\">\n		<input type=\"text\" class=\"form-control form-control-under\" value=\"";
  if (stack1 = helpers.department) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.department); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "\">\n	</div>\n	<label for=\"department\" class=\"col-sm-2 text-muted control-label-under\">\n		Dep.\n	</label>\n</div>";
  return buffer;
  });
this["HBS"] = this["HBS"] || {};this["HBS"]["client_index_template"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<div class=\"col-lg-12\">\n	<div class=\"portlet portlet-default\">\n		<div class=\"portlet-heading\">\n			<div class=\"portlet-title\">\n				<h4>Clientes</h4>\n			</div>\n			<div class=\"portlet-widgets\">\n				<a href=\"#clients-table-container\" data-toggle=\"collapse\" data-parent=\"#accordion\">\n					<i class=\"fa fa-chevron-down\"></i>\n				</a>\n			</div>\n			<div class=\"clearfix\"></div>\n		</div>\n		<div id=\"clients-table-container\" class=\"panel-collapse in\" style=\"height: auto;\">\n			<div class=\"portlet-body\">\n				<div class=\"table-responsive\">\n					<table id=\"clients-table\" class=\"table table-striped table-bordered table-hover table-green dataTable\" aria-describedby=\"clients-table-info\">\n						<thead>\n							<tr>\n								<th>Nombre</th>\n								<th>Documento</th>\n								<th>Telefono/s</th>\n								<th>Dirección/es</th>\n								<th>E-mail</th>\n							</tr>\n						</thead>\n						<tbody role=\"alert\" aria-live=\"polite\" aria-relevant=\"all\">\n							<tr>\n								<td>Guzmán Monné</td>\n								<td>41234567</td>\n								<td>\n									<ul class=\"list-unstyled\">\n										<li>099858585</li>\n										<li>26962131</li>\n									</ul>\n								</td>\n								<td>\n									<address>\n										<strong>Av. Italia 1234</strong>, Malvin, Montevideo\n									</address>\n									<address>\n										<strong>8 de Octubre 2022</strong>, Las Piedras, Montevideo\n									</address>\n								</td>\n								<td>prueba@example.com</td>\n							</tr>\n							<tr>\n								<td>Juan Perez</td>\n								<td>34321569</td>\n								<td>\n									<ul class=\"list-unstyled\">\n										<li>099858545</li>\n									</ul>\n								</td>\n								<td>\n									<address>\n										<strong>Andes 2021 esq Wilson Ferreira</strong>, Centro, Montevideo\n									</address>\n								</td>\n								<td>jperez@hotmail.com</td>\n							</tr>\n							<tr>\n								<td>Pedro Picapiedra</td>\n								<td>00000001</td>\n								<td>\n									<ul class=\"list-unstyled\">\n										<li>099000000</li>\n									</ul>\n								</td>\n								<td>\n									<address>\n										<strong>Piedra Floja 666</strong>, Piedra Lisa, Roca Grande\n									</address>\n								</td>\n								<td>ppicapiedra@rockmail.com</td>\n							</tr>\n						</tbody>\n					</table>\n				</div>\n			</div>\n		</div>\n	</div>\n</div>";
  });
this["HBS"] = this["HBS"] || {};this["HBS"]["client_new_template"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<div class=\"col-lg-offset-2 col-lg-8\">\n	<div class=\"portlet portlet-default\">\n		<div class=\"portlet-heading\">\n			<div class=\"portlet-title\">\n				<h4>Datos de Nuevo Cliente</h4>\n			</div>\n			<div class=\"portlet-widgets\">\n				<a href=\"#formControls\" data-toggle=\"collapse\" data-parent=\"#accordion\">\n					<i class=\"fa fa-chevron-down\"></i>\n				</a>\n			</div>\n			<div class=\"clearfix\"></div>\n		</div>\n		<div id=\"formControls\" class=\"panel-collapse in\" style=\"height: auto;\">\n			<div class=\"portlet-body\">\n				<form class=\"form-horizontal\">\n					<div class=\"form-group\">\n						<label for=\"name\" class=\"col-sm-2 control-label\">Nombre</label>\n						<div class=\"col-sm-10\">\n							<input type=\"text\" class=\"form-control\" name=\"name\" placeholder=\"Juan Perez\">\n						</div>\n					</div>\n					<div class=\"form-group\">\n						<label for=\"doc\" class=\"col-sm-2 control-label\">Documento</label>\n						<div class=\"col-sm-3\">\n							<select name=\"doc-type\" class=\"form-control\">\n								<option value=\"CI\">C.I.</option>\n								<option value=\"RUT\">R.U.T</option>\n								<option value=\"DNI\">DNI</option>\n								<option value=\"Pasaporte\">Pasaporte</option>\n							</select>\n						</div>\n						<div class=\"col-sm-7\">\n							<input type=\"text\" class=\"form-control\" name=\"doc-number\" placeholder=\"4123456; 2123456789\">\n						</div>\n					</div>\n					<div class=\"form-group\" id=\"phone-numbers\">\n						<label for=\"phone\" class=\"col-sm-2 control-label\">Telefono</label>\n						<div class=\"col-sm-8\">\n							<input type=\"text\" class=\"form-control\" name=\"phone\" placeholder=\"099123456; 25019898\" data-type=\"phone-number\">\n						</div>\n						<div class=\"col-sm-2\">\n							<button type=\"button\" class=\"btn btn-success\" id=\"add-phone-number\" tabindex = \"-1\">\n								<i class=\"fa fa-plus\"></i>\n							</button>\n						</div>\n					</div>\n					<div class=\"form-group\" id=\"addresses\">\n						<div class=\"row\" style=\"margin: 0\">\n							<label for=\"address\" class=\"col-sm-2 control-label\">Dirección</label>\n							<div class=\"col-sm-8\">\n								<input type=\"text\" class=\"form-control\" name=\"street\" placeholder=\"Av. 18 de Julio 123\">\n							</div>\n							<label for=\"street\" class=\"col-sm-2 control-label text-muted\" style=\"text-align: left; margin-bottom: 7px\">\n								Calle\n							</label>\n\n							<div class=\"col-sm-2 form-control-under\">\n								<button type=\"button\" class=\"btn btn-success pull-right\" id=\"add-address\" tabindex = \"-1\">\n									<i class=\"fa fa-plus\"></i>\n								</button>\n							</div>\n							\n							<div class=\"col-sm-8\">\n								<input type=\"text\" class=\"form-control form-control-under\" name=\"city\" placeholder=\"Las Piedras\">\n							</div>\n							<label for=\"city\" class=\"col-sm-2 text-muted control-label-under\">\n								Ciudad\n							</label>\n							<div class=\"col-sm-8 col-sm-offset-2\">\n								<input type=\"text\" class=\"form-control form-control-under\" name=\"department\" placeholder=\"Artigas\">\n							</div>\n							<label for=\"department\" class=\"col-sm-2 text-muted control-label-under\">\n								Dep.\n							</label>\n						</div>\n					</div>\n					<div class=\"form-group\">\n						<label for=\"email\" class=\"col-sm-2 control-label\">E-mail</label>\n						<div class=\"col-sm-10\">\n							<input type=\"text\" class=\"form-control\" name=\"email\" placeholder=\"ejemplo@server.com\">\n						</div>\n					</div>\n					<hr>\n					<div class=\"form-group\">\n						<div class=\"col-sm-offset-2 col-sm-10\">\n							<button type=\"submit\" class=\"btn btn-dark-blue\">Crear</button>\n						</div>\n					</div>\n				</form>\n			</div>\n		</div>	\n	</div>\n</div>";
  });
this["HBS"] = this["HBS"] || {};this["HBS"]["phone_field_template"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<div class=\"col-sm-8 col-sm-offset-2\">\n	<input type=\"text\" class=\"form-control form-control-under\" value=\"";
  if (stack1 = helpers.number) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.number); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "\" id=\"";
  if (stack1 = helpers.timestamp) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.timestamp); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "\" data-type=\"phone-number\">\n</div>​<div class=\"col-sm-2\">\n	<button type=\"button\" class=\"btn btn-danger form-control-under del-phone-number\" tabindex = \"-1\" data-phone-id=\"";
  if (stack1 = helpers.timestamp) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.timestamp); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "\">\n		<i class=\"fa fa-minus\"></i>\n	</button>\n</div>";
  return buffer;
  });
this["HBS"] = this["HBS"] || {};this["HBS"]["breadcrumbs_template"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<div class=\"col-lg-12\">\n	<div class=\"page-title\">\n		<h1 id=\"page-title\">\n			Clientes\n			<small id=\"sub-page-title\">Nuevo Cliente</small>\n		</h1>\n	</div>\n	<ol class=\"breadcrumb\">\n		<li>\n			<i class=\"fa fa-dashboard\"></i>\n			<a href=\"/\">Dashboard</a>\n		</li>\n		<li class=\"active\">Nuevo Cliente</li>\n	</ol>\n</div>";
  });
this["HBS"] = this["HBS"] || {};this["HBS"]["alerts_layout_template"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<a data-toggle=\"dropdown\" href=\"#\" class=\"dropdown-toggle alerts-link\">\n  <i class=\"fa fa-bell fa-fw\">\n  </i>\n  <i class=\"fa fa-caret-down\">\n  </i>\n</a>\n<ul class=\"dropdown-menu dropdown-alerts\">\n  <li>\n    <a href=\"#\">\n      <div>\n        <i class=\"fa fa-comment fa-fw\">\n        </i>\n        New Comment \n        <span class=\"pull-right text-muted small\">\n          4 minutes ago\n        </span>\n      </div>\n    </a>\n  </li>\n  <li class=\"divider\">\n  </li>\n  <li>\n    <a href=\"#\">\n      <div>\n        <i class=\"fa fa-twitter fa-fw\">\n        </i>\n        3 New Followers\n        <span class=\"pull-right text-muted small\">\n          12 minutes ago\n        </span>\n      </div>\n    </a>\n  </li>\n  <li class=\"divider\">\n  </li>\n  <li>\n    <a href=\"#\">\n      <div>\n        <i class=\"fa fa-envelope fa-fw\">\n        </i>\n        Message Sent\n        <span class=\"pull-right text-muted small\">\n          6 minutes ago\n        </span>\n      </div>\n    </a>\n  </li>\n  <li class=\"divider\">\n  </li>\n  <li>\n    <a href=\"#\">\n      <div>\n        <i class=\"fa fa-tasks fa-fw\">\n        </i>\n        New Task\n        <span class=\"pull-right text-muted small\">\n          20 minutes ago\n        </span>\n      </div>\n    </a>\n  </li>\n  <li class=\"divider\">\n  </li>\n  <li>\n    <a href=\"#\">\n      <div>\n        <i class=\"fa fa-upload fa-fw\">\n        </i>\n        Server Rebooted\n        <span class=\"pull-right text-muted small\">\n          20 minutes ago\n        </span>\n      </div>\n    </a>\n  </li>\n  <li class=\"divider\">\n  </li>\n  <li>\n    <a href=\"#\" class=\"text-center\">\n      <strong>\n        See All Alerts \n      </strong>\n      <i class=\"fa fa-angle-right\">\n      </i>\n    </a>\n  </li>\n</ul>\n          ";
  });
this["HBS"] = this["HBS"] || {};this["HBS"]["messages_layout_template"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "\n  <a data-toggle=\"dropdown\" href=\"#\" class=\"dropdown-toggle messages-link\">\n    <i class=\"fa fa-envelope fa-fw\">\n    </i>\n    <i class=\"fa fa-caret-down\">\n    </i>\n  </a>\n  <!-- DROPDOWN MESSAGES BEGIN-->\n  <ul class=\"dropdown-menu dropdown-messages\">\n    <li>\n      <a href=\"#\">\n        <div>\n          <strong>\n            Guzman Monne\n          </strong>\n          <span class=\"pull-right text-muted\">\n            <em>\n              Yesterday\n            </em>\n          </span>\n        </div>\n        <div>\n          lorem ipsum sit amet, concsefic adipscil elit.\n        </div>\n      </a>\n    </li>\n    <li class=\"divider\">\n    </li>\n    <li>\n      <a class=\"#\">\n        <div>\n          <strong>\n            Guzman Monne\n          </strong>\n          <span class=\"pull-right text-muted\">\n            <em>\n              Yesterday\n            </em>\n          </span>\n        </div>\n        <div>\n          All my troubles seem so far away. Now I'm here just seeing you say. Oh, I believe in yesterday\n        </div>\n      </a>\n    </li>\n    <li class=\"divider\">\n    </li>\n    <li>\n      <a href=\"#\" class=\"text-center\">\n        <strong>\n          Read all messages \n        </strong>\n        <i class=\"fa fa-angle-right\">\n        </i>\n      </a>\n    </li>\n  </ul>\n  <!-- DROPDOWN MESSAGES END-->\n";
  });
this["HBS"] = this["HBS"] || {};this["HBS"]["nav_template"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<div class=\"navbar-header\">\n  <button type=\"button\" data-toggle=\"collapse\" data-target=\".sidebar-collapse\" class=\"navbar-toggle\">\n    <span class=\"sr-only\">\n      Toggle navigation\n    </span>\n    <span class=\"icon-bar\">\n    </span>\n    <span class=\"icon-bar\">\n    </span>\n    <span class=\"icon-bar\">\n    </span>\n  </button>\n  <a href=\"/\" class=\"navbar-brand\">\n    AOS\n  </a>\n</div>\n<!-- NAVBAR HEADER-->\n<ul class=\"nav navbar-top-links navbar-left\" id=\"toggle-sidebar\">\n  <li class=\"tooltip-sidebar-toggle\">\n    <a href=\"#\" id=\"sidebar-toggle\">\n      <i class=\"fa fa-bars\">\n      </i>\n    </a>\n  </li>\n</ul>\n<ul id=\"nav-monitor-el\" class=\"nav navbar-top-links navbar-right\"></ul>";
  });
this["HBS"] = this["HBS"] || {};this["HBS"]["tasks_layout_template"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "\n    <a data-toggle=\"dropdown\" href=\"#\" class=\"dropdown-toggle tasks-link\">\n      <i class=\"fa fa-tasks fa-fw\">\n      </i>\n      <i class=\"fa fa-caret-down\">\n      </i>\n    </a>\n    <ul class=\"dropdown-menu dropdown-tasks\">\n      <li>\n        <a href=\"#\">\n          <div>\n            <p>\n              <strong>\n                Task 1\n              </strong>\n              <span class=\"pull-right text-muted\">\n                40% Complete (success)\n              </span>\n            </p>\n            <div class=\"progress progress-striped active\">\n              <div role=\"progressbar\" aria-valuenow=\"40\" aria-valuemin=\"0\" aria-valuemax=\"100\" style=\"width: 40%\" class=\"progress-bar progress-bar-success\">\n                <span class=\"sr-only\">\n                  40% Complete (success)\n                </span>\n              </div>\n            </div>\n          </div>\n        </a>\n      </li>\n      <li class=\"divider\">\n      </li>\n      <li>\n        <a href=\"#\">\n          <div>\n            <p>\n              <strong>\n                Task 2\n              </strong>\n              <span class=\"pull-right text-muted\">\n                60% Complete (warning)\n              </span>\n            </p>\n            <div class=\"progress progress-striped active\">\n              <div role=\"progressbar\" aria-valuenow=\"60\" aria-valuemin=\"0\" aria-valuemax=\"100\" style=\"width: 60%\" class=\"progress-bar progress-bar-warning\">\n                <span class=\"sr-only\">\n                  60% Complete (warning)\n                </span>\n              </div>\n            </div>\n          </div>\n        </a>\n      </li>\n      <li class=\"divider\">\n      </li>\n      <li>\n        <a href=\"#\">\n          <div>\n            <p>\n              <strong>\n                Task 3\n              </strong>\n              <span class=\"pull-right text-muted\">\n                20% Complete (info)\n              </span>\n            </p>\n            <div class=\"progress progress-striped active\">\n              <div role=\"progressbar\" aria-valuenow=\"20\" aria-valuemin=\"0\" aria-valuemax=\"100\" style=\"width: 20%\" class=\"progress-bar progress-bar-info\">\n                <span class=\"sr-only\">\n                  20% Complete (info)\n                </span>\n              </div>\n            </div>\n          </div>\n        </a>\n      </li>\n      <li class=\"divider\">\n      </li>\n      <li>\n        <a href=\"#\">\n          <div>\n            <p>\n              <strong>\n                Task 4\n              </strong>\n              <span class=\"pull-right text-muted\">\n                80% Complete (danger)\n              </span>\n            </p>\n            <div class=\"progress progress-striped active\">\n              <div role=\"progressbar\" aria-valuenow=\"80\" aria-valuemin=\"0\" aria-valuemax=\"100\" style=\"width: 80%\" class=\"progress-bar progress-bar-danger\">\n                <span class=\"sr-only\">\n                  80% Complete (danger)\n                </span>\n              </div>\n            </div>\n          </div>\n        </a>\n      </li>\n    </ul>\n";
  });
this["HBS"] = this["HBS"] || {};this["HBS"]["user_settings_template"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<a data-toggle=\"dropdown\" href=\"#\" class=\"dropdown-toggle\">\n  <i class=\"fa fa-user da-fw\">\n  </i>\n  <i class=\"fa fa-caret-down\">\n  </i>\n</a>\n<ul class=\"dropdown-menu dropdown-user\">\n  <li>\n    <a href=\"#\">\n      <i class=\"fa fa-user fa-fw\">\n      </i>\n      User Profile\n    </a>\n  </li>\n  <li>\n    <a href=\"#\">\n      <i class=\"fa fa-gear fa-fw\">\n      </i>\n      Settings\n    </a>\n  </li>\n  <li class=\"divider\">\n  </li>\n  <li>\n    <a href=\"#\">\n      <i class=\"fa fa-sign-out fa-fw\">\n      </i>\n      Logout\n    </a>\n  </li>\n</ul>";
  });