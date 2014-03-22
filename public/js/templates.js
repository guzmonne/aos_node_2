this["HBS"] = this["HBS"] || {};this["HBS"]["appliance_carousel_template"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<div class=\"col-lg-12\">\n	<div class=\"row\">\n		<div class=\"col-xs-2\">\n			<button id=\"prev-model\" class=\"btn btn-primary pull-left\">\n				<i class=\"fa fa-chevron-left\"></i> Anterior\n			</button>\n		</div>\n		<div class=\"col-xs-8\">\n			<button class=\"btn btn-primary btn-block active\" style=\"padding: 3px; margin-top: 1px\">\n				<strong style=\"font-size: 18px\">\n					<span id=\"appliance-id\"></span>\n				</strong>\n			</button>\n		</div>\n		<div class=\"col-xs-2\">\n			<button id=\"next-model\" class=\"btn btn-primary pull-right\">\n				Siguiente <i class=\"fa fa-chevron-right\"></i>\n			</button>\n		</div>\n	</div>\n	<div class=\"row\">\n		<div class=\"col-lg-12\">\n			<hr style=\"margin: 10px\">\n		</div>\n	</div>\n	<div class=\"row\">\n		<div class=\"col-lg-12\" id=\"appliance-form\"></div>\n	</div>\n</div>";
  });
this["HBS"] = this["HBS"] || {};this["HBS"]["appliance_edit_form_template"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "";
  buffer += "\n								<option value=\""
    + escapeExpression((typeof depth0 === functionType ? depth0.apply(depth0) : depth0))
    + "\">"
    + escapeExpression((typeof depth0 === functionType ? depth0.apply(depth0) : depth0))
    + "</option>\n							";
  return buffer;
  }

  buffer += "<div class=\"col-lg-offset-1 col-lg-9 col-md-12\">\n	<form class=\"form-horizontal\">\n		\n		\n		\n		<div class=\"row\">\n			<div class=\"col-md-6\">\n				<div class=\"form-group\">\n					<label for=\"brand\" class=\"col-sm-3 control-label\">Marca</label>\n					<div class=\"col-sm-9\">\n						<input readonly type=\"text\" class=\"form-control\" name=\"brand\" placeholder=\"e.j: Punktal\" value=\"";
  if (stack1 = helpers.brand) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.brand); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "\">\n					</div>\n				</div>\n				<div class=\"form-group\">\n					<label for=\"model\" class=\"col-sm-3 control-label\">Modelo</label>\n					<div class=\"col-sm-9\">\n						<input readonly type=\"text\" class=\"form-control\" name=\"model\" placeholder=\"e.j: PKT1020\" value=\"";
  if (stack1 = helpers.model) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.model); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "\">\n					</div>\n				</div>\n				<div class=\"form-group\">\n					<label for=\"serial\" class=\"col-sm-3 control-label\">Serie</label>\n					<div class=\"col-sm-9\">\n						<input readonly type=\"text\" class=\"form-control\" name=\"serial\" placeholder=\"e.j: AXE102032\" value=\"";
  if (stack1 = helpers.serial) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.serial); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "\">\n					</div>\n				</div>\n			</div>\n			<div class=\"col-md-6\">\n				<div class=\"form-group\">\n					<label for=\"category\" class=\"col-sm-4 control-label\">Categoría</label>\n					<div class=\"col-sm-8\">\n						<input readonly type=\"text\" class=\"form-control\" name=\"category\" placeholder=\"e.j: Electrodomestico\" value=\"";
  if (stack1 = helpers.category) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.category); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "\">\n					</div>\n				</div>\n				<div class=\"form-group\">\n					<label for=\"subcategory\" class=\"col-sm-4 control-label\">Subcategoría</label>\n					<div class=\"col-sm-8\">\n						<input readonly type=\"text\" class=\"form-control\" name=\"subcategory\" placeholder=\"e.j: Plancha\" value=\"";
  if (stack1 = helpers.subcategory) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.subcategory); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "\">\n					</div>\n				</div>\n			</div>\n		</div>\n\n		\n		<div class=\"row\">\n			<div class=\"col-lg-12\">\n				<hr style=\"margin-top: 0;\">\n			</div>\n		</div>\n		\n\n		\n		\n		\n		<div class=\"row\">\n			<div class=\"col-lg-12\">\n				<div class=\"form-group\">\n					<label for=\"accessories\" class=\"col-sm-2 control-label\">Accesorios</label>\n					<div class=\"col-sm-10\">\n						<select disabled class=\"form-control\" name=\"accessories\" data-role=\"tagsinput\" multiple>\n							";
  stack1 = helpers.each.call(depth0, (depth0 && depth0.accessories), {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "	\n						</select>	\n					</div>\n				</div>\n				<div class=\"form-group\">\n					<label for=\"observations\" class=\"col-sm-2 control-label\">Observaciones</label>\n					<div class=\"col-sm-10\">\n						<textarea readonly class=\"form-control\" name=\"observations\">";
  if (stack1 = helpers.observations) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.observations); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "</textarea>\n					</div>\n				</div>\n			</div>\n		</div>\n\n		\n		<div class=\"row\">\n			<div class=\"col-lg-12\">\n				<hr style=\"margin-top: 0;\">\n			</div>\n		</div>\n		\n\n		\n		\n		\n		<div class=\"row\">\n			<div class=\"col-lg-12\">\n				<div class=\"form-group\">\n					<label for=\"repairement_type\" class=\"col-sm-2 control-label\">Tipo de Rep.</label>\n					<div class=\"col-sm-10\">\n						<select disabled class=\"form-control\" name=\"repairement_type\" value=";
  if (stack1 = helpers.repairment_type) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.repairment_type); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + ">\n							<option value=\"Garantía\">Garantía</option>\n							<option value=\"Presupuesto\">Presupuesto</option>\n						</select>	\n					</div>\n				</div>\n				<div class=\"form-group\">\n					<label for=\"defect\" class=\"col-sm-2 control-label\">Defecto</label>\n					<div class=\"col-sm-10\">\n						<textarea readonly class=\"form-control\" name=\"defect\">";
  if (stack1 = helpers.defect) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.defect); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "</textarea>\n					</div>\n				</div>\n			</div>\n		</div>\n\n	</form>\n</div>";
  return buffer;
  });
this["HBS"] = this["HBS"] || {};this["HBS"]["appliance_form_container"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, stack2, options, functionType="function", escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing;


  buffer += "<div class=\"col-lg-12 well\" id=\"appliance-";
  if (stack1 = helpers.index) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.index); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "\" style=\"border-radius: 0;";
  if (stack1 = helpers.style) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.style); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "\"> \n	<div class=\"row\">  \n		<div class=\"col-xs-10\"> \n			<h4> \n				Equipo #";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.sum || (depth0 && depth0.sum)),stack1 ? stack1.call(depth0, (depth0 && depth0.index), 1, options) : helperMissing.call(depth0, "sum", (depth0 && depth0.index), 1, options)))
    + " \n			</h4> \n		</div> \n		<div class=\"col-xs-2\"> \n			<button class=\"btn btn-danger btn-small pull-right appliance-delete\" data-index=\"";
  if (stack2 = helpers.index) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = (depth0 && depth0.index); stack2 = typeof stack2 === functionType ? stack2.call(depth0, {hash:{},data:data}) : stack2; }
  buffer += escapeExpression(stack2)
    + "\" tabindex=\"-1\"> \n				<i class=\"fa fa-times\"></i> \n			</button> \n		</div> \n		<div class=\"col-xs-12\"><hr style=\"margin: 0\"></div> \n	</div> \n	<div class=\"row\" id=\"appliance-container-";
  if (stack2 = helpers.index) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = (depth0 && depth0.index); stack2 = typeof stack2 === functionType ? stack2.call(depth0, {hash:{},data:data}) : stack2; }
  buffer += escapeExpression(stack2)
    + "\"></div> 	\n</div> ";
  return buffer;
  });
this["HBS"] = this["HBS"] || {};this["HBS"]["appliance_index_template"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<div class=\"col-lg-12\">\n	<table id=\"appliances-table-";
  if (stack1 = helpers.timestamp) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.timestamp); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "\" class=\"table table-striped table-bordered table-hover table-office dataTable\" aria-describedby=\"appliances-table-info\">\n		<thead>\n			<tr>\n				<th>ID</th>\n				<th>Cliente</th>	\n				<th>Marca</th>\n				<th>Modelo</th>\n				<th>Serie</th>\n				<th>Estado</th>\n				<th>Creado</th>\n				<th>Cerrado</th>\n				<th class=\"text-center\"><i class=\"fa fa-wrench\"></i></th>\n			</tr>\n		</thead>\n		<tbody role=\"alert\" aria-live=\"polite\" aria-relevant=\"all\" id=\"appliances\">\n		</tbody>\n	</table>\n</div>\n";
  return buffer;
  });
this["HBS"] = this["HBS"] || {};this["HBS"]["appliance_row_template"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n	<td>";
  if (stack1 = helpers.client_name) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.client_name); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "</td>\n";
  return buffer;
  }

  buffer += "<td>";
  if (stack1 = helpers.id) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.id); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "</td>\n";
  stack1 = helpers.unless.call(depth0, (depth0 && depth0.sameClient), {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n<td>";
  if (stack1 = helpers.brand) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.brand); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "</td>\n<td>";
  if (stack1 = helpers.model) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.model); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "</td>\n<td>";
  if (stack1 = helpers.serial) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.serial); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "</td>\n<td>";
  if (stack1 = helpers.status) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.status); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "</td>\n<td>";
  if (stack1 = helpers.updatedAt) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.updatedAt); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "</td>\n<td>";
  if (stack1 = helpers.closedAt) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.closedAt); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "</td>\n<td class=\"center-vh\">\n	<button id=\"show-appliance\" class=\"btn btn-green\">\n		<i class=\"fa fa-ellipsis-h fa-lg\"></i>\n	</button>\n</td>";
  return buffer;
  });
this["HBS"] = this["HBS"] || {};this["HBS"]["appliance_single_form_template"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n		\n		<div class=\"row\">\n			<div class=\"col-lg-12\">\n				<h5>Datos del Cliente</h5>\n			</div>\n		</div>\n		<div class=\"row\">\n			<div class=\"col-md-6 col-sm-6\">\n				<div class=\"form-group\">\n					<label for=\"client_name\" class=\"col-sm-3 control-label\">\n						Cliente\n					</label>\n					<div class=\"col-sm-9\">\n						<input type=\"text\" class=\"form-control\" name=\"client_name\" placeholder=\"e.j: Juan Perez\" value=\"";
  if (stack1 = helpers.client_name) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.client_name); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "\">\n					</div>\n				</div>\n			</div>\n			<div class=\"col-md-5 col-sm-5\">\n				<div class=\"form-group\">\n					<label for=\"client_id\" class=\"col-sm-5 control-label\">ID de Cliente</label>\n					<div class=\"col-sm-7\" style=\"padding-left:5px;\">\n						<input type=\"text\" class=\"form-control\" name=\"client_id\" placeholder=\"e.j: nn1234\" value=\"";
  if (stack1 = helpers.client_id) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.client_id); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "\">\n					</div>\n				</div>\n			</div>\n			<div class=\"col-md-1 col-sm-1\">\n				<div class=\"form-group pull-right\">\n					<div class=\"col-sm-12\">\n						<button class=\"btn btn-info pull-left\" tabindex=\"-1\">\n							<i class=\"fa fa-search\"></i>\n						</button>\n					</div>\n				</div>\n			</div>\n		</div>\n		\n		<div class=\"row\">\n			<div class=\"col-lg-12\">\n				<hr style=\"margin: 0;\">\n			</div>\n		</div>\n	";
  return buffer;
  }

function program3(depth0,data) {
  
  var buffer = "";
  buffer += "\n							<option value=\""
    + escapeExpression((typeof depth0 === functionType ? depth0.apply(depth0) : depth0))
    + "\">"
    + escapeExpression((typeof depth0 === functionType ? depth0.apply(depth0) : depth0))
    + "</option>\n						";
  return buffer;
  }

  buffer += "<div id=\"appliance-form\" class=\"form-horizontal\">\n	\n	";
  stack1 = helpers.unless.call(depth0, (depth0 && depth0.client_id), {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n	\n	<div class=\"row\">\n		<div class=\"col-lg-12\">\n			<h5>Datos del Equipo</h5>\n		</div>\n	</div>\n	<div class=\"row\">\n		<div class=\"col-md-6\">\n			<div class=\"form-group\">\n				<label for=\"brand\" class=\"col-sm-3 control-label\">Marca</label>\n				<div class=\"col-sm-9\">\n					<input type=\"text\" class=\"form-control\" name=\"brand\" placeholder=\"e.j: Punktal\" value=\"";
  if (stack1 = helpers.brand) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.brand); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "\">\n				</div>\n			</div>\n			<div class=\"form-group\">\n				<label for=\"model\" class=\"col-sm-3 control-label\">Modelo</label>\n				<div class=\"col-sm-9\">\n					<input type=\"text\" class=\"form-control\" name=\"model\" placeholder=\"e.j: PKT1020\" value=\"";
  if (stack1 = helpers.model) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.model); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "\">\n				</div>\n			</div>\n			<div class=\"form-group\">\n				<label for=\"serial\" class=\"col-sm-3 control-label\">Serie</label>\n				<div class=\"col-sm-9\">\n					<input type=\"text\" class=\"form-control\" name=\"serial\" placeholder=\"e.j: AXE102032\" value=\"";
  if (stack1 = helpers.serial) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.serial); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "\">\n				</div>\n			</div>\n		</div>\n		<div class=\"col-md-6\">\n			<div class=\"form-group\">\n				<label for=\"category\" class=\"col-sm-4 control-label\">Categoría</label>\n				<div class=\"col-sm-8\">\n					<input type=\"text\" class=\"form-control\" name=\"category\" placeholder=\"e.j: Electrodomestico\" value=\"";
  if (stack1 = helpers.category) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.category); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "\">\n				</div>\n			</div>\n			<div class=\"form-group\">\n				<label for=\"subcategory\" class=\"col-sm-4 control-label\">Subcategoría</label>\n				<div class=\"col-sm-8\">\n					<input type=\"text\" class=\"form-control\" name=\"subcategory\" placeholder=\"e.j: Plancha\" value=\"";
  if (stack1 = helpers.subcategory) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.subcategory); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "\">\n				</div>\n			</div>\n			<div class=\"form-group\">\n				<div class=\"col-sm-offset-4 col-sm-8\">\n					<button class=\"btn btn-info btn-block\" tabindex=\"-1\">\n						<i class=\"fa fa-search\"></i> Buscar Equipo\n					</button>\n				</div>\n			</div>\n		</div>\n	</div>\n	\n	<div class=\"row\">\n		<div class=\"col-lg-12\">\n			<hr style=\"margin: 0;\">\n		</div>\n	</div>\n	\n	<div class=\"row\">\n		<div class=\"col-lg-12\">\n			<div class=\"form-group\">\n				<label for=\"accessories\" class=\"col-sm-2 control-label\">Accesorios</label>\n				<div class=\"col-sm-10\">\n					<select class=\"form-control\" name=\"accessories\" data-role=\"tagsinput\" multiple>\n						";
  stack1 = helpers.each.call(depth0, (depth0 && depth0.accessories), {hash:{},inverse:self.noop,fn:self.program(3, program3, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "	\n					</select>	\n				</div>\n			</div>\n			<div class=\"form-group\">\n				<label for=\"observations\" class=\"col-sm-2 control-label\">Observaciones</label>\n				<div class=\"col-sm-10\">\n					<textarea class=\"form-control\" name=\"observations\">";
  if (stack1 = helpers.observations) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.observations); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "</textarea>\n				</div>\n			</div>\n		</div>\n	</div>\n	\n	<div class=\"row\">\n		<div class=\"col-lg-12\">\n			<hr style=\"margin: 0;\">\n		</div>\n	</div>\n	\n	<div class=\"row\">\n		<div class=\"col-lg-12\">\n			<h5>Datos de Reparación</h5>\n		</div>\n	</div>\n	<div class=\"row\">\n		<div class=\"col-lg-12\">\n			<div class=\"form-group\">\n				<label for=\"repairement_type\" class=\"col-sm-2 control-label\">Tipo de Rep.</label>\n				<div class=\"col-sm-10\">\n					<select class=\"form-control\" name=\"repairement_type\">\n						<option value=\"Garantía\">Garantía</option>\n						<option value=\"Presupuesto\">Presupuesto</option>\n					</select>	\n				</div>\n			</div>\n			<div class=\"form-group\">\n				<label for=\"defect\" class=\"col-sm-2 control-label\">Defecto</label>\n				<div class=\"col-sm-10\">\n					<textarea class=\"form-control\" name=\"defect\">";
  if (stack1 = helpers.defect) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.defect); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "</textarea>\n				</div>\n			</div>\n		</div>\n	</div>\n	\n	<div class=\"row\">\n		<div class=\"col-lg-12\">\n			<hr style=\"margin: 0;\">\n		</div>\n	</div>\n	\n</div>";
  return buffer;
  });
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
this["HBS"] = this["HBS"] || {};this["HBS"]["client_details_template"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, options, functionType="function", escapeExpression=this.escapeExpression, self=this, blockHelperMissing=helpers.blockHelperMissing;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n          <li><i class=\"fa fa-phone fa-muted fa-fw\"></i>";
  if (stack1 = helpers.number) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.number); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "</li>\n        ";
  return buffer;
  }

function program3(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n          <li>\n            <i class=\"fa fa-building-o fa-muted fa-fw\"></i> \n            ";
  if (stack1 = helpers.street) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.street); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + ".<br>\n            ";
  if (stack1 = helpers.city) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.city); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + ", ";
  if (stack1 = helpers.department) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.department); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "\n          </li>\n        ";
  return buffer;
  }

  buffer += "<div class=\"col-md-12 col-lg-offset-1 col-lg-10\">\n  <span class=\"pull-right\" style=\"margin-top: 20px\">\n    <a href=\"#render/client/index\" class=\"pull-right text-muted\">\n      <i class=\"fa fa-list fa-3x\"></i>\n    </a>\n  </span>\n  <h1>\n     ";
  if (stack1 = helpers.name) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.name); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "\n     <small class=\"text-right\">\n      ";
  if (stack1 = helpers['doc-type']) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0['doc-type']); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + " <i class=\"fa fa-barcode\"></i> ";
  if (stack1 = helpers['doc-number']) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0['doc-number']); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "\n    </small>\n  </h1>\n  </h1>\n  <hr>\n  <div class=\"row\">\n    <div class=\"col-xs-4\">\n      <ul class=\"list-unstyled\">\n        ";
  options = {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data};
  if (stack1 = helpers.phones) { stack1 = stack1.call(depth0, options); }
  else { stack1 = (depth0 && depth0.phones); stack1 = typeof stack1 === functionType ? stack1.call(depth0, options) : stack1; }
  if (!helpers.phones) { stack1 = blockHelperMissing.call(depth0, stack1, options); }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n      </ul>\n      <ul class=\"list-unstyled\"> \n        ";
  options = {hash:{},inverse:self.noop,fn:self.program(3, program3, data),data:data};
  if (stack1 = helpers.addresses) { stack1 = stack1.call(depth0, options); }
  else { stack1 = (depth0 && depth0.addresses); stack1 = typeof stack1 === functionType ? stack1.call(depth0, options) : stack1; }
  if (!helpers.addresses) { stack1 = blockHelperMissing.call(depth0, stack1, options); }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n      </ul>\n      <p>\n        <i class=\"fa fa-envelope-o fa-muted fa-fw\"></i>  \n        <a href=\"#\">\n          ";
  if (stack1 = helpers.email) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.email); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "\n        </a>\n      </p>\n    </div>\n    <div class=\"col-xs-8\">\n      <div class=\"table-responsive\">\n        <table class=\"table table-striped table-hover table-office table-office-green table-condensed table-bordered\">\n          <thead>\n            <tr>\n              <th>Descripción</th>\n              <th class=\"text-center\">Cantidad</th>\n            </tr>\n          </thead>\n          <tbody>\n            <tr>\n              <td>Equipos en Stock</td>\n              <td class=\"text-center\">5</td>\n            </tr>\n            <tr>\n              <td>Equipos Reparados</td>\n              <td class=\"text-center\">4</td>\n            </tr>\n            <tr>\n              <td>Equipos Pendientes</td>\n              <td class=\"text-center\">9</td>\n            </tr>\n            <tr>\n              <td>Equipos Terminados</td>\n              <td class=\"text-center\">4</td>\n            </tr>\n          </tbody>\n        </table>\n      </div>\n    </div>\n  </div>\n  <hr>\n  <div class=\"row\">\n    <div class=\"col-sm-6\">\n      <small>\n        Creado el ";
  if (stack1 = helpers.createdAt) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.createdAt); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + " por ";
  if (stack1 = helpers.createdBy) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.createdBy); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "\n      </small>\n    </div>\n    <div class=\"col-sm-6 text-right\">\n      <small>\n        Modificado el ";
  if (stack1 = helpers.updatedAt) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.updatedAt); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + " por ";
  if (stack1 = helpers.updatedBy) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.updatedBy); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "\n      </small>\n    </div>\n  </div>\n</div>";
  return buffer;
  });
this["HBS"] = this["HBS"] || {};this["HBS"]["client_form_template"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, stack2, options, functionType="function", escapeExpression=this.escapeExpression, self=this, helperMissing=helpers.helperMissing;

function program1(depth0,data) {
  
  
  return "selected=\"true\"";
  }

function program3(depth0,data) {
  
  
  return "\n				Telefonos\n			";
  }

function program5(depth0,data) {
  
  
  return "\n				Telefono\n			";
  }

function program7(depth0,data) {
  
  var buffer = "", stack1, stack2;
  buffer += "\n		<div class=\"col-xs-8 col-xs-offset-2\" data-source-index=\""
    + escapeExpression(((stack1 = ((stack1 = data),stack1 == null || stack1 === false ? stack1 : stack1.index)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\">\n			<input type=\"text\" class=\"form-control form-control-under\" value=\"";
  if (stack2 = helpers.number) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = (depth0 && depth0.number); stack2 = typeof stack2 === functionType ? stack2.call(depth0, {hash:{},data:data}) : stack2; }
  buffer += escapeExpression(stack2)
    + "\" readonly>\n		</div>​<div class=\"col-xs-2\">\n			<button type=\"button\" class=\"btn btn-danger form-control-under del-phone-number\" tabindex = \"-1\" data-phone-index=\""
    + escapeExpression(((stack1 = ((stack1 = data),stack1 == null || stack1 === false ? stack1 : stack1.index)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\">\n				<i class=\"fa fa-minus\"></i>\n			</button>\n			<button type=\"button\" class=\"btn btn-warning form-control-under edit-phone-number\" tabindex = \"-1\" data-phone-index=\""
    + escapeExpression(((stack1 = ((stack1 = data),stack1 == null || stack1 === false ? stack1 : stack1.index)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\">\n				<i class=\"fa fa-pencil\"></i>\n			</button>\n		</div>\n		";
  return buffer;
  }

function program9(depth0,data) {
  
  
  return "\n					Direcciones\n				";
  }

function program11(depth0,data) {
  
  
  return "\n					Dirección\n				";
  }

function program13(depth0,data) {
  
  var buffer = "", stack1, stack2;
  buffer += "\n			<div class=\"row\" style=\"margin: 0\">\n				<hr>\n				<div class=\"col-xs-2 form-control-under\">\n					<button type=\"button\" class=\"btn btn-warning pull-right edit-address\" tabindex = \"-1\" data-source-index=\""
    + escapeExpression(((stack1 = ((stack1 = data),stack1 == null || stack1 === false ? stack1 : stack1.index)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" style=\"margin-left: 4px;\">\n						<i class=\"fa fa-pencil\"></i>\n					</button>\n					<button type=\"button\" class=\"btn btn-danger pull-right del-address\" tabindex = \"-1\" data-source-index=\""
    + escapeExpression(((stack1 = ((stack1 = data),stack1 == null || stack1 === false ? stack1 : stack1.index)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\">\n						<i class=\"fa fa-minus\"></i>\n					</button>\n				</div>\n				<div class=\"col-xs-8 form-control-under\">\n					<input type=\"text\" class=\"form-control\" value=\"";
  if (stack2 = helpers.street) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = (depth0 && depth0.street); stack2 = typeof stack2 === functionType ? stack2.call(depth0, {hash:{},data:data}) : stack2; }
  buffer += escapeExpression(stack2)
    + "\" readonly>\n				</div>\n				<label for=\"street\" class=\"col-xs-2 text-muted control-label-under\" style=\"text-align: left; margin-bottom: 8px\">\n					Calle\n				</label>\n				<div class=\"col-xs-8 col-xs-offset-2\">\n					<input type=\"text\" class=\"form-control form-control-under\" value=\"";
  if (stack2 = helpers.city) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = (depth0 && depth0.city); stack2 = typeof stack2 === functionType ? stack2.call(depth0, {hash:{},data:data}) : stack2; }
  buffer += escapeExpression(stack2)
    + "\" readonly>\n				</div>\n				<label for=\"city\" class=\"col-xs-2 text-muted control-label-under\">\n					Ciudad\n				</label>\n				<div class=\"col-xs-8 col-xs-offset-2\">\n					<input type=\"text\" class=\"form-control form-control-under\" value=\"";
  if (stack2 = helpers.department) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = (depth0 && depth0.department); stack2 = typeof stack2 === functionType ? stack2.call(depth0, {hash:{},data:data}) : stack2; }
  buffer += escapeExpression(stack2)
    + "\" readonly>\n				</div>\n				<label for=\"department\" class=\"col-xs-2 text-muted control-label-under\">\n					Dep.\n				</label>\n			</div>\n		";
  return buffer;
  }

function program15(depth0,data) {
  
  
  return "\n			<div class=\"col-xs-offset-2 col-xs-8\">\n				<button type=\"submit\" class=\"btn btn-dark-blue\">Crear</button>\n			</div>\n		";
  }

function program17(depth0,data) {
  
  
  return "\n			<div class=\"col-xs-offset-2 col-xs-8\">\n				<button id=\"update-form\" class=\"btn btn-warning\">Actualizar</button>\n			</div>\n		";
  }

  buffer += "<form class=\"form-horizontal\">\n	<div class=\"form-group\">\n		<label for=\"name\" class=\"col-xs-2 control-label\">Nombre</label>\n		<div class=\"col-xs-10\">\n			<input type=\"text\" class=\"form-control\" name=\"name\" placeholder=\"Juan Perez\" value=\"";
  if (stack1 = helpers.name) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.name); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "\">\n		</div>\n	</div>\n	<div class=\"form-group\">\n		<label for=\"doc\" class=\"col-xs-2 control-label\">Doc</label>\n		<div class=\"col-xs-3\">\n			<select name=\"doc-type\" class=\"form-control\">\n				<option value=\"CI\" ";
  options = {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data};
  stack2 = ((stack1 = helpers.is || (depth0 && depth0.is)),stack1 ? stack1.call(depth0, "CI", (depth0 && depth0['doc-type']), options) : helperMissing.call(depth0, "is", "CI", (depth0 && depth0['doc-type']), options));
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += ">C.I.</option>\n				<option value=\"RUT\" ";
  options = {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data};
  stack2 = ((stack1 = helpers.is || (depth0 && depth0.is)),stack1 ? stack1.call(depth0, "RUT", (depth0 && depth0['doc-type']), options) : helperMissing.call(depth0, "is", "RUT", (depth0 && depth0['doc-type']), options));
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += ">R.U.T</option>\n				<option value=\"DNI\" ";
  options = {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data};
  stack2 = ((stack1 = helpers.is || (depth0 && depth0.is)),stack1 ? stack1.call(depth0, "DNI", (depth0 && depth0['doc-type']), options) : helperMissing.call(depth0, "is", "DNI", (depth0 && depth0['doc-type']), options));
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += ">DNI</option>\n				<option value=\"Pasaporte\" ";
  options = {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data};
  stack2 = ((stack1 = helpers.is || (depth0 && depth0.is)),stack1 ? stack1.call(depth0, "Pasaporte", (depth0 && depth0['doc-type']), options) : helperMissing.call(depth0, "is", "Pasaporte", (depth0 && depth0['doc-type']), options));
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += ">Pasaporte</option>\n			</select>\n		</div>\n		<div class=\"col-xs-7\">\n			<input type=\"text\" class=\"form-control\" name=\"doc-number\" placeholder=\"4123456; 2123456789\" value=\"";
  if (stack2 = helpers['doc-number']) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = (depth0 && depth0['doc-number']); stack2 = typeof stack2 === functionType ? stack2.call(depth0, {hash:{},data:data}) : stack2; }
  buffer += escapeExpression(stack2)
    + "\">\n		</div>\n	</div>\n	<div class=\"form-group\" id=\"phone-numbers\">\n		<label for=\"phone\" class=\"col-xs-2 control-label\">\n			";
  options = {hash:{},inverse:self.program(5, program5, data),fn:self.program(3, program3, data),data:data};
  stack2 = ((stack1 = helpers.is || (depth0 && depth0.is)),stack1 ? stack1.call(depth0, ((stack1 = (depth0 && depth0.phones)),stack1 == null || stack1 === false ? stack1 : stack1.length), ">", 1, options) : helperMissing.call(depth0, "is", ((stack1 = (depth0 && depth0.phones)),stack1 == null || stack1 === false ? stack1 : stack1.length), ">", 1, options));
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n		</label>\n		<div class=\"col-xs-8\">\n			<input type=\"text\" class=\"form-control\" name=\"phone\" placeholder=\"099123456; 25019898\" data-type=\"phone-number\">\n		</div>\n		<div class=\"col-xs-2\">\n			<button type=\"button\" class=\"btn btn-success\" id=\"add-phone-number\" data-for=\"phone\" tabindex = \"-1\">\n				<i class=\"fa fa-plus\"></i>\n			</button>\n		</div>\n		";
  stack2 = helpers.each.call(depth0, (depth0 && depth0.phones), {hash:{},inverse:self.noop,fn:self.program(7, program7, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n	</div>\n	<div class=\"form-group\" id=\"addresses\">\n		<div class=\"row\" style=\"margin: 0\">\n			<label for=\"address\" class=\"col-xs-2 control-label\">\n				";
  options = {hash:{},inverse:self.program(11, program11, data),fn:self.program(9, program9, data),data:data};
  stack2 = ((stack1 = helpers.is || (depth0 && depth0.is)),stack1 ? stack1.call(depth0, ((stack1 = (depth0 && depth0.address)),stack1 == null || stack1 === false ? stack1 : stack1.length), ">", 1, options) : helperMissing.call(depth0, "is", ((stack1 = (depth0 && depth0.address)),stack1 == null || stack1 === false ? stack1 : stack1.length), ">", 1, options));
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n			</label>\n			<div class=\"col-xs-8\">\n				<input type=\"text\" class=\"form-control\" name=\"street\" placeholder=\"Av. 18 de Julio 123\">\n			</div>\n			<label for=\"street\" class=\"col-xs-2 control-label text-muted\" style=\"text-align: left; margin-bottom: 7px\">\n				Calle\n			</label>\n\n			<div class=\"col-xs-2 form-control-under\">\n				<button type=\"button\" class=\"btn btn-success pull-right\" id=\"add-address\" tabindex = \"-1\" data-for=\"street\">\n					<i class=\"fa fa-plus\"></i>\n				</button>\n			</div>\n			\n			<div class=\"col-xs-8\">\n				<input type=\"text\" class=\"form-control form-control-under\" name=\"city\" placeholder=\"Las Piedras\">\n			</div>\n			<label for=\"city\" class=\"col-xs-2 text-muted control-label-under\">\n				Ciudad\n			</label>\n			<div class=\"col-xs-8 col-xs-offset-2\">\n				<input type=\"text\" class=\"form-control form-control-under\" name=\"department\" placeholder=\"Artigas\">\n			</div>\n			<label for=\"department\" class=\"col-xs-2 text-muted control-label-under\">\n				Dep.\n			</label>\n		</div>\n		";
  stack2 = helpers.each.call(depth0, (depth0 && depth0.addresses), {hash:{},inverse:self.noop,fn:self.program(13, program13, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n	</div>\n	<div class=\"form-group\">\n		<label for=\"email\" class=\"col-xs-2 control-label\">E-mail</label>\n		<div class=\"col-xs-10\">\n			<input type=\"email\" class=\"form-control\" name=\"email\" placeholder=\"ejemplo@server.com\" value=\"";
  if (stack2 = helpers.email) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = (depth0 && depth0.email); stack2 = typeof stack2 === functionType ? stack2.call(depth0, {hash:{},data:data}) : stack2; }
  buffer += escapeExpression(stack2)
    + "\">\n		</div>\n	</div>\n	<hr>\n	<div class=\"form-group\">\n		";
  stack2 = helpers.unless.call(depth0, (depth0 && depth0._id), {hash:{},inverse:self.program(17, program17, data),fn:self.program(15, program15, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n	</div>\n</form>\n";
  return buffer;
  });
this["HBS"] = this["HBS"] || {};this["HBS"]["client_index_template"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<div class=\"col-lg-12\">\n	<div class=\"row air-b\">\n		<div class=\"col-lg-12\">\n			<a href=\"#render/client/new\" class=\"btn btn-primary\" id=\"new-service-request\">\n				<i class=\"fa fa-plus\"></i> Nuevo Cliente\n			</a>\n		</div>\n	</div>\n	<div class=\"row\">\n		<div class=\"col-lg-12\">\n			<table id=\"clients-table-";
  if (stack1 = helpers.timestamp) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.timestamp); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "\" class=\"table table-striped table-bordered table-hover table-office\" aria-describedby=\"clients-table-info\">\n				<thead>\n					<tr>\n						<th>Nombre</th>\n						<th>Documento</th>\n						<th>Telefono/s</th>\n						<th>Dirección/es</th>\n						<th>E-mail</th>\n						<th class=\"text-center\"><i class=\"fa fa-wrench\"></i></th>\n					</tr>\n				</thead>\n				<tbody role=\"alert\" aria-live=\"polite\" aria-relevant=\"all\" id=\"clients\">\n				</tbody>\n			</table>\n		</div>\n	</div>\n</div>\n			";
  return buffer;
  });
this["HBS"] = this["HBS"] || {};this["HBS"]["client_new_template"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "";


  return buffer;
  });
this["HBS"] = this["HBS"] || {};this["HBS"]["client_row_template"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, options, functionType="function", escapeExpression=this.escapeExpression, self=this, blockHelperMissing=helpers.blockHelperMissing;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n			<li>";
  if (stack1 = helpers.number) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.number); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "</li>\n		";
  return buffer;
  }

function program3(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n		<address>\n	  	<strong>";
  if (stack1 = helpers.street) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.street); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "</strong>.<br>\n	  	";
  if (stack1 = helpers.city) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.city); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + ", ";
  if (stack1 = helpers.department) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.department); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "\n		</address>\n	";
  return buffer;
  }

  buffer += "<td>";
  if (stack1 = helpers.name) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.name); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "</td>\n<td>\n	<dt>";
  if (stack1 = helpers['doc-type']) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0['doc-type']); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + ":</dt>\n	<dd>";
  if (stack1 = helpers['doc-number']) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0['doc-number']); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "</dd>\n</td>\n<td>\n	<ul class=\"list-unstyled\">\n		";
  options = {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data};
  if (stack1 = helpers.phones) { stack1 = stack1.call(depth0, options); }
  else { stack1 = (depth0 && depth0.phones); stack1 = typeof stack1 === functionType ? stack1.call(depth0, options) : stack1; }
  if (!helpers.phones) { stack1 = blockHelperMissing.call(depth0, stack1, options); }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n	</ul>\n</td>\n<td>\n	";
  options = {hash:{},inverse:self.noop,fn:self.program(3, program3, data),data:data};
  if (stack1 = helpers.addresses) { stack1 = stack1.call(depth0, options); }
  else { stack1 = (depth0 && depth0.addresses); stack1 = typeof stack1 === functionType ? stack1.call(depth0, options) : stack1; }
  if (!helpers.addresses) { stack1 = blockHelperMissing.call(depth0, stack1, options); }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n</td>\n<td>";
  if (stack1 = helpers.email) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.email); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "</td>\n<td class=\"center-vh\">\n	<a href=\"#render/client/show/";
  if (stack1 = helpers._id) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0._id); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "\" id=\"show-client\" class=\"btn btn-green\">\n		<i class=\"fa fa-ellipsis-h fa-lg\"></i>\n	</a>\n</td>";
  return buffer;
  });
this["HBS"] = this["HBS"] || {};this["HBS"]["client_show_template"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<ul id=\"client-tabs\" class=\"nav nav-tabs\">\n  <li class=\"active\">\n  	<a href=\"#client-details-";
  if (stack1 = helpers.timestamp) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.timestamp); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "\" data-toggle=\"tab\">\n  		Detalle\n  	</a>\n  </li>\n  <li>\n  	<a href=\"#client-service-orders-";
  if (stack1 = helpers.timestamp) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.timestamp); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "\" data-toggle=\"tab\" id=\"client-service-requests\">\n  		Ordenes de Servicio\n  	</a>\n  </li>\n  <li>\n  	<a href=\"#client-apparatus-";
  if (stack1 = helpers.timestamp) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.timestamp); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "\" data-toggle=\"tab\">\n  		Equipos\n  	</a>\n  </li>\n  <li>\n  	<a href=\"#client-edit-";
  if (stack1 = helpers.timestamp) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.timestamp); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "\" data-toggle=\"tab\" id=\"client-edit\">\n  		Editar Datos\n  	</a>\n  </li>\n</ul>\n<div id=\"client-tab-content\" class=\"tab-content\">\n  <div class=\"tab-pane fade in active\" id=\"client-details-";
  if (stack1 = helpers.timestamp) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.timestamp); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "\"></div>\n  <div class=\"tab-pane fade in air-t\" id=\"client-service-orders-";
  if (stack1 = helpers.timestamp) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.timestamp); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "\">\n    <div id=\"client-service_requests-";
  if (stack1 = helpers.timestamp) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.timestamp); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "\"></div>\n  </div>\n  <div class=\"tab-pane fade in air-t\" id=\"client-appliances-";
  if (stack1 = helpers.timestamp) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.timestamp); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "\">\n  	<h3>Equipos</h3>\n  </div>\n  <div class=\"tab-pane fade in air-t\" id=\"client-edit-";
  if (stack1 = helpers.timestamp) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.timestamp); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "\">\n  	<div id=\"client-form-";
  if (stack1 = helpers.timestamp) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.timestamp); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "\" class=\"row\"></div>\n  </div>\n</div>";
  return buffer;
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
this["HBS"] = this["HBS"] || {};this["HBS"]["app_template"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<div id=\"content-el\"></div>";
  });
this["HBS"] = this["HBS"] || {};this["HBS"]["bs_callout_template"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n";
  if (stack1 = helpers.htmlMsg) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.htmlMsg); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n";
  return buffer;
  }

  buffer += "<button type=\"button\" class=\"close\" aria-hidden=\"true\">&times;</button>\n<h4>";
  if (stack1 = helpers.title) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.title); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "</h4>\n<p>";
  if (stack1 = helpers.message) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.message); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "</p>\n";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.htmlMsg), {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  return buffer;
  });
this["HBS"] = this["HBS"] || {};this["HBS"]["go_to_top_template"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<a href=\"#\" class=\"btn btn-sm btn-fixed btn-fixed-r-d-corner\" data-toggle=\"tooltip\" data-placement=\"top\" title=\"Subir\">\n	<i class=\"fa fa-angle-double-up\"></i>\n</a>";
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
this["HBS"] = this["HBS"] || {};this["HBS"]["portlet_template"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<div class=\"col-lg-12\">\n	<div id=\"portlet-frame\" class=\"portlet portlet-default\">\n		<div class=\"portlet-heading\">\n			<div class=\"portlet-title\">\n				<h4 id=\"portlet-title-header\"></h4>\n			</div>\n			<div class=\"portlet-widgets\">\n				<a href=\"#\" id=\"close\" data-toggle=\"tooltip\" data-placement=\"top\" title=\"Cerrar\">\n					<i class=\"fa fa-times\"></i>\n				</a>\n			</div>\n			<div class=\"portlet-widgets\" data-toggle=\"tooltip\" data-placement=\"top\" title=\"Colapsar\">\n				<a href=\"#view-";
  if (stack1 = helpers.cid) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.cid); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "\" id=\"collapse\" data-toggle=\"collapse\" data-parent=\"#accordion\">\n					<i class=\"fa fa-chevron-up\"></i>\n				</a>\n			</div>\n			<div class=\"portlet-widgets\">\n				<a href=\"#\" id=\"sync\" data-toggle=\"tooltip\" data-placement=\"top\" title=\"Sincronizar\">\n					<i class=\"fa fa-undo\"></i>\n				</a>\n			</div>\n			<div class=\"clearfix\"></div>\n		</div>\n		<div id=\"view-";
  if (stack1 = helpers.cid) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.cid); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "\" class=\"panel-collapse in\" style=\"height: auto;\">\n				<div id=\"portlet-messages\"></div>\n				<div id=\"portlet-body\" class=\"portlet-body\"></div>\n		</div>	\n	</div>\n</div>";
  return buffer;
  });
this["HBS"] = this["HBS"] || {};this["HBS"]["search_template"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<input type=\"text\" class=\"form-control\" placeholder=\"Buscar...\">\n<span class=\"input-group-btn\">\n	<button type=\"button\" class=\"btn btn-default\">\n		<i class=\"fa fa-search\"></i>\n	</button>\n</span>";
  });
this["HBS"] = this["HBS"] || {};this["HBS"]["side_nav_template"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<div class=\"sidebar-collapse\">\n	<ul id=\"side-menu\" class=\"nav\">\n		<li class=\"text-center\">\n			<img src=\"http://placehold.it/150x150\" alr=\"User Image\" class=\"img-circle air-t-b\">\n			<p class=\"text-muted\">\n				<i class=\"fa fa-key\"></i> Guzmán <strong>Monné</strong>\n			</p>\n		</li>\n		<li class=\"sidebar-search\"></li>\n		<li>\n			<a href=\"#\">\n				<i class=\"fa fa-dashboard fa-fw\"></i> Dashboard\n			</a>\n		</li>\n		<li>\n			<a href=\"#\">\n				<i class=\"fa fa-users fa-fw\"></i> Clientes \n				<span class=\"fa arrow\"></span>\n			</a>\n			<ul class=\"nav nav-second-level\">\n				<li>				\n					<a href=\"#render/client/new\">\n						<i class=\"fa fa-plus fa-fw\"></i> Nuevo\n					</a>\n				</li>\n				<li>				\n					<a href=\"#render/client/index\">\n						<i class=\"fa fa-list-alt fa-fw\"></i> Lista\n					</a>\n				</li>\n			</ul>\n		</li>\n		<li>\n			<a href=\"#\">\n				<i class=\"fa fa-clipboard fa-fw\"></i> Ordenes de Servicio\n				<span class=\"fa arrow\"></span>\n			</a>\n			<ul class=\"nav nav-second-level\">\n				<li>\n					<a href=\"#render/service_request/new\">\n						<i class=\"fa fa-plus fa-fw\"></i> Nuevo\n					</a>\n				</li>\n				<li>\n					<a href=\"#render/service_request/index\">\n						<i class=\"fa fa-list-alt fa-fw\"></i> Lista\n					</a>\n				</li>\n			</ul>\n		</li>\n		<li>\n			<a href=\"#\">\n				<i class=\"fa fa-desktop fa-fw\"></i> Equipos \n				<span class=\"fa arrow\"></span>\n			</a>\n			<ul class=\"nav nav-second-level\">\n				<li>				\n					<a href=\"#render/appliance/index\">\n						<i class=\"fa fa-list-alt fa-fw\"></i> Lista\n					</a>\n				</li>\n			</ul>\n		</li>\n		<li>\n			<a href=\"#\">\n				<i class=\"fa fa-sitemap fa-fw\"></i> Multi-Level Dropdown\n				<span class=\"fa arrow\"></span>\n			</a>\n			<ul class=\"nav nav-second-level\">\n				<li>				\n					<a href=\"#\">\n						<i class=\"fa fa-angle-right fa-fw\"></i> Second Level Item \n					</a>\n				</li>\n				<li>				\n					<a href=\"#\">\n						<i class=\"fa fa-angle-right fa-fw\"></i> Second Level Item \n					</a>\n				</li>\n				<li>				\n					<a href=\"#\">\n						<i class=\"fa fa-angle-right fa-fw\"></i> Second Level Item \n					</a>\n				</li>\n				<li>				\n					<a href=\"#\" class=\"third-level\">\n						<i class=\"fa fa-angle-right fa-fw\"></i> Third Level\n						<span class=\"fa arrow\"></span>\n					</a>\n					<ul class=\"nav nav-third-level\">\n						<li>				\n							<a href=\"#\">\n								<i class=\"fa fa-angle-double-right fa-fw\"></i> Third Level Item \n							</a>\n						</li>\n						<li>				\n							<a href=\"#\">\n								<i class=\"fa fa-angle-double-right fa-fw\"></i> Third Level Item \n							</a>\n						</li>\n						<li>				\n							<a href=\"#\">\n								<i class=\"fa fa-angle-double-right fa-fw\"></i> Third Level Item \n							</a>\n						</li>\n					</ul>\n				</li>\n			</ul>\n		</li>\n		<li>\n			<a href=\"#\">\n				<i class=\"fa fa-files-o fa-fw\"></i> Sample Pages\n				<span class=\"fa arrow\"></span>\n			</a>\n			<ul class=\"nav nav-second-level\">\n				<li>\n					<a href=\"#\">\n						<i class=\"fa fa-angle-right fa-fw\"></i> Blank Page\n					</a>\n				</li>\n				<li>\n					<a href=\"#\">\n						<i class=\"fa fa-angle-right fa-fw\"></i> Login Page\n					</a>\n				</li>\n			</ul>\n		</li>\n	</ul>\n</div>";
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
this["HBS"] = this["HBS"] || {};this["HBS"]["service_request_form_template"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, self=this, functionType="function", escapeExpression=this.escapeExpression;

function program1(depth0,data) {
  
  
  return "col-xs-10";
  }

function program3(depth0,data) {
  
  
  return "col-xs-8";
  }

function program5(depth0,data) {
  
  
  return "readonly";
  }

function program7(depth0,data) {
  
  
  return "\n					<div class=\"col-xs-2\">\n						<button class=\"btn btn-info\">\n							<i class=\"fa fa-search\"></i>\n						</button>\n					</div>\n				";
  }

function program9(depth0,data) {
  
  
  return "\n			<div class=\"col-xs-offset-10 col-xs-2\">\n				<button type=\"submit\" class=\"btn btn-dark-blue pull-right\">Crear</button>\n			</div>\n		";
  }

function program11(depth0,data) {
  
  
  return "\n			<div class=\"col-xs-offset-10 col-xs-2\">\n				<button id=\"update-form\" class=\"btn btn-warning pull-right\">Actualizar</button>\n			</div>\n		";
  }

  buffer += "<div class=\"form-horizontal\">\n	<div class=\"row\">\n		<div class=\"col-lg-offset-1 col-lg-6 col-md-8 col-xs-8\">\n			<div class=\"form-group\">\n				<label for=\"client_name\" class=\"col-xs-2 control-label\">Cliente</label>\n				<div class=\"";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.client_id), {hash:{},inverse:self.program(3, program3, data),fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\">\n					<input type=\"text\" class=\"form-control\" name=\"client_name\" placeholder=\"Juan Perez\" value=\"";
  if (stack1 = helpers.client_name) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.client_name); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "\" ";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.client_name), {hash:{},inverse:self.noop,fn:self.program(5, program5, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += ">\n				</div>\n				";
  stack1 = helpers.unless.call(depth0, (depth0 && depth0.client_id), {hash:{},inverse:self.noop,fn:self.program(7, program7, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n			</div>\n		</div>\n		<div class=\"col-lg-3 col-md-4 col-xs-4\">\n			<div class=\"form-group\">\n				<label for=\"invoiceNumber\" class=\"col-xs-4 control-label\">Remito</label>\n				<div class=\"col-xs-8\">\n					<input type=\"text\" class=\"form-control\" name=\"invoiceNumber\" placeholder=\"e.j: A142985\" value=\"";
  if (stack1 = helpers.invoiceNumber) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.invoiceNumber); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "\" ";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.invoiceNumber), {hash:{},inverse:self.noop,fn:self.program(5, program5, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += ">\n				</div>\n			</div>\n		</div>\n		<div class=\"col-lg-6 col-md-6\" style=\"display: none;\">\n			<div class=\"form-group\">\n				<label for=\"client_id\" class=\"col-xs-4 control-label\">ID Cliente</label>\n				<div class=\"col-xs-8\">\n					<input type=\"text\" class=\"form-control\" name=\"client_id\" placeholder=\"Juan Perez\" value=\"";
  if (stack1 = helpers.client_id) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.client_id); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "\" ";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.client_id), {hash:{},inverse:self.noop,fn:self.program(5, program5, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += ">\n				</div>\n			</div>\n		</div>\n	</div>\n	<hr style=\"margin-top: 0\">\n	<div class=\"row\">\n		<div class=\"col-lg-offset-1 col-lg-10 col-md-12\">\n			<div class=\"row\" id=\"appliance-views\"></div>\n		</div>\n		<div class=\"col-lg-offset-1 col-lg-10 col-md-12\">\n			<button class=\"btn btn-success\" id=\"single-appliance\">\n				<i class=\"fa fa-plus\"></i> Nuevo Equipo\n			</button>\n			<button class=\"btn btn-success\" id=\"multiple-appliance\">\n				<i class=\"fa fa-table\"></i> Carga Masiva\n			</button>\n			<hr style=\"margin-bottom: 0;\">\n		</div>\n	</div>\n	<div class=\"form-group\" style=\"margin-top: 10px;\">\n		";
  stack1 = helpers.unless.call(depth0, (depth0 && depth0._id), {hash:{},inverse:self.program(11, program11, data),fn:self.program(9, program9, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n	</div>\n</div>";
  return buffer;
  });
this["HBS"] = this["HBS"] || {};this["HBS"]["service_request_index_template"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<div class=\"col-lg-12\">\n	<div class=\"row air-b\">\n		<div class=\"col-lg-12\">\n			<button class=\"btn btn-primary\" id=\"new-service-request\">\n				<i class=\"fa fa-plus\"></i> Nueva Orden de Servicio\n			</button>\n		</div>\n	</div>\n	<div class=\"row\">\n		<div class=\"col-lg-12\">\n			<table id=\"service_requests-table-";
  if (stack1 = helpers.timestamp) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.timestamp); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "\" class=\"table table-striped table-bordered table-hover table-office dataTable\" aria-describedby=\"service_requests-table-info\">\n				<thead>\n					<tr>\n						<th>ID</th>\n						<th>Cliente</th>\n						<th>Cant. de Equipos</th>\n						<th>Estado</th>\n						<th>Creado</th>\n						<th>Finalizado</th>\n						<th class=\"text-center\"><i class=\"fa fa-wrench\"></i></th>\n					</tr>\n				</thead>\n				<tbody role=\"alert\" aria-live=\"polite\" aria-relevant=\"all\" id=\"service_requests\">\n				</tbody>\n			</table>\n		</div>\n	</div>\n</div>";
  return buffer;
  });
this["HBS"] = this["HBS"] || {};this["HBS"]["service_request_new_template"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "";


  return buffer;
  });
this["HBS"] = this["HBS"] || {};this["HBS"]["service_request_row_template"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<td>";
  if (stack1 = helpers.id) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.id); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "</td>\n<td>";
  if (stack1 = helpers.client_name) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.client_name); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "</td>\n<td class=\"text-center\">";
  if (stack1 = helpers.appliances_length) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.appliances_length); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "</td>\n<td>";
  if (stack1 = helpers.status) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.status); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "</td>\n<td>";
  if (stack1 = helpers.createdAt) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.createdAt); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "</td>\n<td>";
  if (stack1 = helpers.closedAt) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.closedAt); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "</td>\n<td class=\"center-vh\">\n	<a href=\"#render/service_request/show/";
  if (stack1 = helpers._id) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0._id); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "\" id=\"show-service-request\" class=\"btn btn-green\">\n		<i class=\"fa fa-ellipsis-h fa-lg\"></i>\n	</a>\n</td>";
  return buffer;
  });
this["HBS"] = this["HBS"] || {};this["HBS"]["service_request_show_template"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n          <div class=\"col-sm-6\">\n            <h3 class=\"pull-right\">\n              Remito: \n               <span class=\"text-primary\">";
  if (stack1 = helpers.invoiceNumber) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.invoiceNumber); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "</span>\n             </h3>\n          </div>\n          ";
  return buffer;
  }

  buffer += "<ul id=\"service-request-tabs\" class=\"nav nav-tabs\">\n  <li class=\"active\">\n  	<a href=\"#service-request-details-";
  if (stack1 = helpers.timestamp) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.timestamp); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "\" data-toggle=\"tab\">\n  		Detalle\n  	</a>\n  </li>\n  <li>\n    <a href=\"#service-request-appliances-";
  if (stack1 = helpers.timestamp) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.timestamp); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "\" data-toggle=\"tab\" class=\"sr-appliances\">\n      Equipos\n    </a>\n  </li>\n  <li>\n  	<a href=\"#service-request-edit-";
  if (stack1 = helpers.timestamp) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.timestamp); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "\" data-toggle=\"tab\" id=\"service-request-edit\">\n  		Editar Datos\n  	</a>\n  </li>\n</ul>\n<div id=\"service-request-tab-content\" class=\"tab-content\">\n  <div class=\"tab-pane fade in active\" id=\"service-request-details-";
  if (stack1 = helpers.timestamp) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.timestamp); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "\">\n    <div class=\"row\">\n      <div class=\"col-lg-12\">\n        <h1>\n          Cliente: \n           <a href=\"#render/client/show/";
  if (stack1 = helpers.client_id) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.client_id); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "\">\n            ";
  if (stack1 = helpers.client_name) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.client_name); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "\n          </a>\n          <span class=\"pull-right label ";
  if (stack1 = helpers.label) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.label); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "\">";
  if (stack1 = helpers.status) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.status); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "</span>\n        </h1>\n        <hr style=\"margin: 0\">\n        <div class=\"row\">\n          <div class=\"col-sm-6\">\n              <h3>Equipos</h3>\n          </div>\n          ";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.invoiceNumber), {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n        </div>\n        <div id=\"service-request-appliances\"></div>\n      </div>\n    </div>\n    <hr>\n    <div class=\"row\">\n      <div class=\"col-sm-6\">\n        <small>\n          Creado el ";
  if (stack1 = helpers.createdAt) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.createdAt); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + " por ";
  if (stack1 = helpers.createdBy) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.createdBy); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "\n        </small>\n      </div>\n      <div class=\"col-sm-6 text-right\">\n        <small>\n          Modificado el ";
  if (stack1 = helpers.updatedAt) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.updatedAt); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + " por ";
  if (stack1 = helpers.updatedBy) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.updatedBy); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "\n        </small>\n      </div>\n    </div>\n  </div>\n  <div class=\"tab-pane fade in\" id=\"service-request-edit-";
  if (stack1 = helpers.timestamp) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.timestamp); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "\">\n    <h3>Editar Datos de Orden de Servicio</h3>\n    <div id=\"service-request-form-";
  if (stack1 = helpers.timestamp) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.timestamp); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "\" class=\"row\"></div>\n  </div>\n  <div class=\"tab-pane fade in\" id=\"service-request-appliances-";
  if (stack1 = helpers.timestamp) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.timestamp); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "\"></div>\n</div>";
  return buffer;
  });