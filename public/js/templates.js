this["HBS"] = this["HBS"] || {};this["HBS"]["appliance_edit_form_template"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, stack2, options, functionType="function", escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing, self=this;

function program1(depth0,data) {
  
  var buffer = "";
  buffer += "\n							<option value=\""
    + escapeExpression((typeof depth0 === functionType ? depth0.apply(depth0) : depth0))
    + "\">"
    + escapeExpression((typeof depth0 === functionType ? depth0.apply(depth0) : depth0))
    + "</option>\n						";
  return buffer;
  }

  buffer += "<div id=\"message\"></div>\n<form class=\"form-horizontal\">\n	\n	\n	\n	<div class=\"row\">\n		<div class=\"col-md-6\">\n			<div class=\"form-group\">\n				<label for=\"id\" class=\"col-sm-3 control-label\">ID</label>\n				<div class=\"col-sm-9\">\n					<input disabled type=\"text\" class=\"form-control\" name=\"id\" value=\"";
  if (stack1 = helpers.id) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.id); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "\">\n				</div>\n			</div>\n		</div>\n		<div class=\"col-md-6\">\n			<div class=\"form-group ";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.statusClass || (depth0 && depth0.statusClass)),stack1 ? stack1.call(depth0, (depth0 && depth0.status), "appliance", options) : helperMissing.call(depth0, "statusClass", (depth0 && depth0.status), "appliance", options)))
    + "\">\n				<label for=\"status\" class=\"col-sm-4 control-label\">Estado</label>\n				<div class=\"col-sm-8\">\n				  <select disabled type=\"text\" class=\"form-control\" name=\"status\" value=\"";
  if (stack2 = helpers.status) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = (depth0 && depth0.status); stack2 = typeof stack2 === functionType ? stack2.call(depth0, {hash:{},data:data}) : stack2; }
  buffer += escapeExpression(stack2)
    + "\">\n				  	<option value=\"Pendiente\" ";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers['selected?'] || (depth0 && depth0['selected?'])),stack1 ? stack1.call(depth0, "Pendiente", (depth0 && depth0.status), options) : helperMissing.call(depth0, "selected?", "Pendiente", (depth0 && depth0.status), options)))
    + ">Pendiente</option>\n				  	<option value=\"Abierto\"   ";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers['selected?'] || (depth0 && depth0['selected?'])),stack1 ? stack1.call(depth0, "Abierto", (depth0 && depth0.status), options) : helperMissing.call(depth0, "selected?", "Abierto", (depth0 && depth0.status), options)))
    + ">Abierto</option>\n				  	<option value=\"Atrasado\"  ";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers['selected?'] || (depth0 && depth0['selected?'])),stack1 ? stack1.call(depth0, "Atrasado", (depth0 && depth0.status), options) : helperMissing.call(depth0, "selected?", "Atrasado", (depth0 && depth0.status), options)))
    + ">Atrasado</option>\n				  	<option value=\"Cerrado\"   ";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers['selected?'] || (depth0 && depth0['selected?'])),stack1 ? stack1.call(depth0, "Cerrado", (depth0 && depth0.status), options) : helperMissing.call(depth0, "selected?", "Cerrado", (depth0 && depth0.status), options)))
    + ">Cerrado</option>\n				  </select>\n				</div>\n			</div>\n		</div>\n	</div>\n\n	\n	<div class=\"row\">\n		<div class=\"col-lg-12\">\n			<hr style=\"margin-top: 0;\">\n		</div>\n	</div>\n	\n\n	\n	\n	\n	<div class=\"row\">\n		<div class=\"col-md-6\">\n			<div class=\"form-group\">\n				<label for=\"brand\" class=\"col-sm-3 control-label\">Marca</label>\n				<div class=\"col-sm-9\">\n					<input type=\"text\" class=\"form-control\" name=\"brand\" placeholder=\"e.j: Punktal\" value=\"";
  if (stack2 = helpers.brand) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = (depth0 && depth0.brand); stack2 = typeof stack2 === functionType ? stack2.call(depth0, {hash:{},data:data}) : stack2; }
  buffer += escapeExpression(stack2)
    + "\" disabled>\n				</div>\n			</div>\n			<div class=\"form-group\">\n				<label for=\"model\" class=\"col-sm-3 control-label\">Modelo</label>\n				<div class=\"col-sm-9\">\n					<input type=\"text\" class=\"form-control\" name=\"model\" placeholder=\"e.j: PKT1020\" value=\"";
  if (stack2 = helpers.model) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = (depth0 && depth0.model); stack2 = typeof stack2 === functionType ? stack2.call(depth0, {hash:{},data:data}) : stack2; }
  buffer += escapeExpression(stack2)
    + "\" disabled>\n				</div>\n			</div>\n			<div class=\"form-group\">\n				<label for=\"serial\" class=\"col-sm-3 control-label\">Serie</label>\n				<div class=\"col-sm-9\">\n					<input type=\"text\" class=\"form-control\" name=\"serial\" placeholder=\"e.j: AXE102032\" value=\"";
  if (stack2 = helpers.serial) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = (depth0 && depth0.serial); stack2 = typeof stack2 === functionType ? stack2.call(depth0, {hash:{},data:data}) : stack2; }
  buffer += escapeExpression(stack2)
    + "\">\n				</div>\n			</div>\n		</div>\n		<div class=\"col-md-6\">\n			<div class=\"form-group\">\n				<label for=\"category\" class=\"col-sm-4 control-label\">Categoría</label>\n				<div class=\"col-sm-8\">\n					<input type=\"text\" class=\"form-control\" name=\"category\" placeholder=\"e.j: Electrodomestico\" value=\"";
  if (stack2 = helpers.category) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = (depth0 && depth0.category); stack2 = typeof stack2 === functionType ? stack2.call(depth0, {hash:{},data:data}) : stack2; }
  buffer += escapeExpression(stack2)
    + "\" disabled>\n				</div>\n			</div>\n			<div class=\"form-group\">\n				<label for=\"subcategory\" class=\"col-sm-4 control-label\">Subcategoría</label>\n				<div class=\"col-sm-8\">\n					<input type=\"text\" class=\"form-control\" name=\"subcategory\" placeholder=\"e.j: Plancha\" value=\"";
  if (stack2 = helpers.subcategory) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = (depth0 && depth0.subcategory); stack2 = typeof stack2 === functionType ? stack2.call(depth0, {hash:{},data:data}) : stack2; }
  buffer += escapeExpression(stack2)
    + "\" disabled>\n				</div>\n			</div>\n			<div class=\"form-group\">\n				<div class=\"col-sm-offset-4 col-sm-8\">\n					<button class=\"btn btn-info btn-block\" tabindex=\"-1\" id=\"select-model\">\n						<i class=\"fa fa-search\"></i> Buscar Equipo\n					</button>\n				</div>\n			</div>\n		</div>\n	</div>\n\n	\n	<div class=\"row\">\n		<div class=\"col-lg-12\">\n			<hr style=\"margin-top: 0;\">\n		</div>\n	</div>\n	\n\n	\n	\n	\n	<div class=\"row\">\n		<div class=\"col-lg-12\">\n			<div class=\"form-group\">\n				<label for=\"accessories\" class=\"col-sm-2 control-label\">Accesorios</label>\n				<div class=\"col-sm-10\">\n					<select class=\"form-control\" name=\"accessories\" data-role=\"tagsinput\" multiple>\n						";
  stack2 = helpers.each.call(depth0, (depth0 && depth0.accessories), {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "	\n					</select>	\n				</div>\n			</div>\n			<div class=\"form-group\">\n				<label for=\"observations\" class=\"col-sm-2 control-label\">Observaciones</label>\n				<div class=\"col-sm-10\">\n					<textarea class=\"form-control\" name=\"observations\">";
  if (stack2 = helpers.observations) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = (depth0 && depth0.observations); stack2 = typeof stack2 === functionType ? stack2.call(depth0, {hash:{},data:data}) : stack2; }
  buffer += escapeExpression(stack2)
    + "</textarea>\n				</div>\n			</div>\n			<div class=\"form-group\">\n				<label for=\"technician_name\" class=\"col-sm-2 control-label\">Tecnico</label>\n				<div class=\"col-sm-10\">\n					<select class=\"form-control\" name=\"technician_id\" value=";
  if (stack2 = helpers.technician_id) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = (depth0 && depth0.technician_id); stack2 = typeof stack2 === functionType ? stack2.call(depth0, {hash:{},data:data}) : stack2; }
  buffer += escapeExpression(stack2)
    + ">\n						<option value=\"1\"    ";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers['selected?'] || (depth0 && depth0['selected?'])),stack1 ? stack1.call(depth0, "Guzmán Monné", (depth0 && depth0.technician_id), options) : helperMissing.call(depth0, "selected?", "Guzmán Monné", (depth0 && depth0.technician_id), options)))
    + ">Guzmán Monné</option>\n						<option value=\"2\" ";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers['selected?'] || (depth0 && depth0['selected?'])),stack1 ? stack1.call(depth0, "Felipe Monné", (depth0 && depth0.technician_id), options) : helperMissing.call(depth0, "selected?", "Felipe Monné", (depth0 && depth0.technician_id), options)))
    + ">Felipe Monné</option>\n					</select>	\n				</div>\n			</div>\n		</div>\n	</div>\n\n	\n	<div class=\"row\">\n		<div class=\"col-lg-12\">\n			<hr style=\"margin-top: 0;\">\n		</div>\n	</div>\n	\n\n	\n	\n	\n	<div class=\"row\">\n		<div class=\"col-md-6\">\n			<div class=\"form-group\">\n				<label for=\"repairement_type\" class=\"col-sm-4 control-label\">Reparación</label>\n				<div class=\"col-sm-8\">\n					<select class=\"form-control\" name=\"repairement_type\" value=";
  if (stack2 = helpers.repairment_type) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = (depth0 && depth0.repairment_type); stack2 = typeof stack2 === functionType ? stack2.call(depth0, {hash:{},data:data}) : stack2; }
  buffer += escapeExpression(stack2)
    + ">\n						<option value=\"Garantía\"    ";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers['selected?'] || (depth0 && depth0['selected?'])),stack1 ? stack1.call(depth0, "Garantía", (depth0 && depth0.repairement_type), options) : helperMissing.call(depth0, "selected?", "Garantía", (depth0 && depth0.repairement_type), options)))
    + ">Garantía</option>\n						<option value=\"Presupuesto\" ";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers['selected?'] || (depth0 && depth0['selected?'])),stack1 ? stack1.call(depth0, "Presupuesto", (depth0 && depth0.repairement_type), options) : helperMissing.call(depth0, "selected?", "Presupuesto", (depth0 && depth0.repairement_type), options)))
    + ">Presupuesto</option>\n					</select>	\n				</div>\n			</div>\n		</div>\n		<div class=\"col-md-6\">\n			<div class=\"form-group has-feedback\" id=\"cost-form-group\">\n				<label for=\"cost\" class=\"col-sm-4 control-label\">Presupuesto</label>\n				<div class=\"col-sm-8\">\n				  <div class=\"input-group\">\n					  <span class=\"input-group-addon\">$</span>\n				  	<input type=\"number\" min=\"0\" step=\"1\" class=\"form-control text-right\" name=\"cost\" placeholder=\"ej. 100.00\" value=\"";
  if (stack2 = helpers.cost) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = (depth0 && depth0.cost); stack2 = typeof stack2 === functionType ? stack2.call(depth0, {hash:{},data:data}) : stack2; }
  buffer += escapeExpression(stack2)
    + "\">\n					  <span class=\"input-group-addon\">.00</span>\n					</div>\n				</div>\n			</div>\n		</div>\n	</div>\n\n	\n	<div class=\"row\">\n		<div class=\"col-lg-12\">\n			<hr style=\"margin-top: 0;\">\n		</div>\n	</div>\n	\n\n	\n	\n	\n	<div class=\"row\">\n		<div class=\"col-lg-12\">\n			<div class=\"form-group\">\n				<label for=\"defect\" class=\"col-sm-2 control-label\">Defecto</label>\n				<div class=\"col-sm-10\">\n					<textarea class=\"form-control\" name=\"defect\">";
  if (stack2 = helpers.defect) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = (depth0 && depth0.defect); stack2 = typeof stack2 === functionType ? stack2.call(depth0, {hash:{},data:data}) : stack2; }
  buffer += escapeExpression(stack2)
    + "</textarea>\n				</div>\n			</div>\n			<div class=\"form-group\">\n				<label for=\"diagnose\" class=\"col-sm-2 control-label\">Diagnostico</label>\n				<div class=\"col-sm-10\">\n					<textarea class=\"form-control\" name=\"diagnose\">";
  if (stack2 = helpers.diagnose) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = (depth0 && depth0.diagnose); stack2 = typeof stack2 === functionType ? stack2.call(depth0, {hash:{},data:data}) : stack2; }
  buffer += escapeExpression(stack2)
    + "</textarea>\n				</div>\n			</div>\n		</div>\n	</div>\n\n	\n	<div class=\"row\">\n		<div class=\"col-lg-12\">\n			<hr style=\"margin-top: 0;\">\n		</div>\n	</div>\n	\n\n	\n	\n	\n	<div class=\"row\">\n		<div class=\"col-lg-12\">\n			<div class=\"form-group\">\n				<label for=\"replacements\" class=\"col-sm-2 control-label\">Repuestos</label>\n				<div class=\"col-sm-10\">\n					<select class=\"form-control\" name=\"replacements\" data-role=\"tagsinput\" multiple>\n						";
  stack2 = helpers.each.call(depth0, (depth0 && depth0.replacements), {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "	\n					</select>	\n				</div>\n			</div>\n			<div class=\"form-group\">\n				<label for=\"solution\" class=\"col-sm-2 control-label\">Solución</label>\n				<div class=\"col-sm-10\">\n					<textarea class=\"form-control\" name=\"solution\">";
  if (stack2 = helpers.solution) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = (depth0 && depth0.solution); stack2 = typeof stack2 === functionType ? stack2.call(depth0, {hash:{},data:data}) : stack2; }
  buffer += escapeExpression(stack2)
    + "</textarea>\n				</div>\n			</div>\n		</div>\n	</div>\n\n	\n	<div class=\"row\">\n		<div class=\"col-lg-12\">\n			<hr style=\"margin-top: 0;\">\n		</div>\n	</div>\n	\n\n	\n	\n	\n	<div class=\"row\" style=\"border-radius: 0; margin-bottom: 0\">\n    <div class=\"col-xs-12\">\n      <button id=\"edit-appliance\" class=\"btn btn-primary hide\">\n      	<i class=\"fa fa-pencil\"></i>\n      	 Editar\n      </button>\n      <button id=\"save-appliance\" class=\"btn btn-warning\">\n      	<i class=\"fa fa-save\"></i>\n      	 Guardar Cambios\n      </button>\n      <button id=\"render-appliance\" class=\"btn btn-inverse pull-right\">\n      	<i class=\"fa fa-reply\"></i>\n      	 Reestablecer\n      </button>\n    </div>\n	</div>\n</form>\n";
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
    + "\" class=\"table table-striped table-bordered table-hover table-office dataTable\" aria-describedby=\"appliances-table-info\">\n		<thead>\n			<tr>\n				<th>ID</th>\n				<th>Cliente</th>	\n				<th>Equipo</th>\n				<th>Tipo</th>\n				<th>Estado</th>\n				<th>Tecnico</th>\n				<th>Detalles</th>\n				<th class=\"text-center\"><i class=\"fa fa-wrench\"></i></th>\n			</tr>\n		</thead>\n		<tbody role=\"alert\" aria-live=\"polite\" aria-relevant=\"all\" id=\"appliances\">\n		</tbody>\n	</table>\n</div>\n";
  return buffer;
  });
this["HBS"] = this["HBS"] || {};this["HBS"]["appliance_row_template"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, stack2, options, functionType="function", escapeExpression=this.escapeExpression, self=this, helperMissing=helpers.helperMissing;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n		<dd><i class=\"fa fa-barcode\"></i> ";
  if (stack1 = helpers.serial) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.serial); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "</dd>\n	";
  return buffer;
  }

function program3(depth0,data) {
  
  var buffer = "", stack1, stack2, options;
  buffer += "\n		<dt>";
  if (stack1 = helpers.repairement_type) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.repairement_type); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "</dt>\n		";
  options = {hash:{},inverse:self.noop,fn:self.program(4, program4, data),data:data};
  stack2 = ((stack1 = helpers.is || (depth0 && depth0.is)),stack1 ? stack1.call(depth0, (depth0 && depth0.cost), "not", 0, options) : helperMissing.call(depth0, "is", (depth0 && depth0.cost), "not", 0, options));
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n	";
  return buffer;
  }
function program4(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n			<dd>$";
  if (stack1 = helpers.cost) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.cost); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + ",00</dd>\n		";
  return buffer;
  }

function program6(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n		";
  if (stack1 = helpers.repairement_type) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.repairement_type); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "\n	";
  return buffer;
  }

function program8(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n		<dt>Cerrado</dt>\n		<dd>";
  if (stack1 = helpers.closedAt) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.closedAt); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "</dd>\n	";
  return buffer;
  }

  buffer += "<td>";
  if (stack1 = helpers.id) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.id); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "</td>\n<td>";
  if (stack1 = helpers.client_name) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.client_name); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "</td>\n<td>\n	<dt>";
  if (stack1 = helpers.brand) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.brand); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "</dt>\n	<dd>";
  if (stack1 = helpers.model) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.model); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "</dd>\n	";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.serial), {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n</td>\n<td class=\"text-center\">\n	";
  options = {hash:{},inverse:self.program(6, program6, data),fn:self.program(3, program3, data),data:data};
  stack2 = ((stack1 = helpers.is || (depth0 && depth0.is)),stack1 ? stack1.call(depth0, (depth0 && depth0.repairement_type), "Presupuesto", options) : helperMissing.call(depth0, "is", (depth0 && depth0.repairement_type), "Presupuesto", options));
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n</td>\n<td class=\"text-center\">";
  if (stack2 = helpers.status) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = (depth0 && depth0.status); stack2 = typeof stack2 === functionType ? stack2.call(depth0, {hash:{},data:data}) : stack2; }
  buffer += escapeExpression(stack2)
    + "</td>\n<td>";
  if (stack2 = helpers.technician_name) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = (depth0 && depth0.technician_name); stack2 = typeof stack2 === functionType ? stack2.call(depth0, {hash:{},data:data}) : stack2; }
  buffer += escapeExpression(stack2)
    + "</td>\n<td>\n	<dt>Creado</dt>\n	<dd>";
  if (stack2 = helpers.createdAt) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = (depth0 && depth0.createdAt); stack2 = typeof stack2 === functionType ? stack2.call(depth0, {hash:{},data:data}) : stack2; }
  buffer += escapeExpression(stack2)
    + "</dd>\n	<dt>Actualizado</dt>\n	<dd>";
  if (stack2 = helpers.updatedAt) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = (depth0 && depth0.updatedAt); stack2 = typeof stack2 === functionType ? stack2.call(depth0, {hash:{},data:data}) : stack2; }
  buffer += escapeExpression(stack2)
    + "</dd>\n	";
  stack2 = helpers['if'].call(depth0, (depth0 && depth0.closedAt), {hash:{},inverse:self.noop,fn:self.program(8, program8, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n</td>\n<td class=\"center-vh\">\n	<a href=\"#render/appliance/show/";
  if (stack2 = helpers._id) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = (depth0 && depth0._id); stack2 = typeof stack2 === functionType ? stack2.call(depth0, {hash:{},data:data}) : stack2; }
  buffer += escapeExpression(stack2)
    + "\" class=\"btn btn-green\" data-toggle=\"tooltip\" data-placement=\"top\" title=\"Mas Información\" style=\"margin: 3px;\">\n		<i class=\"fa fa-ellipsis-h fa-fw\"></i>\n	</a>\n	<a href=\"#render/service_request/show/";
  if (stack2 = helpers.service_request_id) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = (depth0 && depth0.service_request_id); stack2 = typeof stack2 === functionType ? stack2.call(depth0, {hash:{},data:data}) : stack2; }
  buffer += escapeExpression(stack2)
    + "\" class=\"btn btn-green\" data-toggle=\"tooltip\" data-placement=\"top\" title=\"Orden de Servicio\" style=\"margin: 3px;\">\n		<i class=\"fa fa-clipboard fa-fw\"></i>\n	</a>\n</td>";
  return buffer;
  });
this["HBS"] = this["HBS"] || {};this["HBS"]["appliance_show_template"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<div class=\"col-md-12\">\n	<h3>\n		Cliente: <a href=\"#render/client/show/";
  if (stack1 = helpers.client_id) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.client_id); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "\">";
  if (stack1 = helpers.client_name) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.client_name); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "</a>\n		<a href=\"#render/service_request/show/";
  if (stack1 = helpers.service_request_id) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.service_request_id); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "\" class=\"btn btn-green pull-right\" data-toggle=\"tooltip\" data-placement=\"top\" title=\"Orden de Servicio\">\n			<i class=\"fa fa-clipboard fa-fw\"></i> Ir a Orden de Servicio\n		</a>\n	</h3>\n</div>\n<div class=\"col-md-12\">\n	<hr style=\"margin: 10px 0 10px 0;\" >\n</div>\n<div class=\"col-lg-offset-2 col-lg-8 col-md-12\" id=\"form-";
  if (stack1 = helpers.cid) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.cid); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "\"></div>";
  return buffer;
  });
this["HBS"] = this["HBS"] || {};this["HBS"]["appliance_single_form_template"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n		\n		<div class=\"row\">\n			<div class=\"col-md-6 col-sm-6\">\n				<div class=\"form-group\">\n					<label for=\"client_name\" class=\"col-sm-3 control-label\">\n						Cliente\n					</label>\n					<div class=\"col-sm-9\">\n						<input readonly type=\"text\" class=\"form-control\" name=\"client_name\" placeholder=\"e.j: Juan Perez\" value=\"";
  if (stack1 = helpers.client_name) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.client_name); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "\">\n					</div>\n				</div>\n			</div>\n			<div class=\"col-md-5 col-sm-5\">\n				<div class=\"form-group\">\n					<label for=\"client_id\" class=\"col-sm-5 control-label\">ID de Cliente</label>\n					<div class=\"col-sm-7\" style=\"padding-left:5px;\">\n						<input readonly type=\"text\" class=\"form-control\" name=\"client_id\" placeholder=\"e.j: nn1234\" value=\"";
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
  buffer += "\n	\n	<div class=\"row\">\n		<div class=\"col-md-6\">\n			<div class=\"form-group\">\n				<label for=\"brand\" class=\"col-sm-3 control-label\">Marca</label>\n				<div class=\"col-sm-9\">\n					<input readonly type=\"text\" class=\"form-control\" name=\"brand\" placeholder=\"e.j: Punktal\" value=\"";
  if (stack1 = helpers.brand) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.brand); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "\" tabindex=\"-1\" >\n				</div>\n			</div>\n			<div class=\"form-group\">\n				<label for=\"model\" class=\"col-sm-3 control-label\">Modelo</label>\n				<div class=\"col-sm-9\">\n					<input readonly type=\"text\" class=\"form-control\" name=\"model\" placeholder=\"e.j: PKT1020\" value=\"";
  if (stack1 = helpers.model) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.model); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "\" tabindex=\"-1\" >\n				</div>\n			</div>\n			<div class=\"form-group\">\n				<label for=\"serial\" class=\"col-sm-3 control-label\">Serie</label>\n				<div class=\"col-sm-9\">\n					<input type=\"text\" class=\"form-control\" name=\"serial\" placeholder=\"e.j: AXE102032\" value=\"";
  if (stack1 = helpers.serial) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.serial); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "\">\n				</div>\n			</div>\n		</div>\n		<div class=\"col-md-6\">\n			<div class=\"form-group\">\n				<label for=\"category\" class=\"col-sm-4 control-label\">Categoría</label>\n				<div class=\"col-sm-8\">\n					<input readonly type=\"text\" class=\"form-control\" name=\"category\" placeholder=\"e.j: Electrodomestico\" value=\"";
  if (stack1 = helpers.category) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.category); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "\" tabindex=\"-1\" >\n				</div>\n			</div>\n			<div class=\"form-group\">\n				<label for=\"subcategory\" class=\"col-sm-4 control-label\">Subcategoría</label>\n				<div class=\"col-sm-8\">\n					<input readonly type=\"text\" class=\"form-control\" name=\"subcategory\" placeholder=\"e.j: Plancha\" value=\"";
  if (stack1 = helpers.subcategory) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.subcategory); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "\" tabindex=\"-1\" >\n				</div>\n			</div>\n			<div class=\"form-group\">\n				<div class=\"col-sm-offset-4 col-sm-8\">\n					<button class=\"btn btn-info btn-block\" tabindex=\"-1\" id=\"select-model\">\n						<i class=\"fa fa-search\"></i> Buscar Equipo\n					</button>\n				</div>\n			</div>\n		</div>\n	</div>\n	\n	<div class=\"row\">\n		<div class=\"col-lg-12\">\n			<hr style=\"margin: 0; margin-bottom: 10px\">\n		</div>\n	</div>\n	\n	<div class=\"row\">\n		<div class=\"col-lg-12\">\n			<div class=\"form-group\">\n				<label for=\"accessories\" class=\"col-sm-2 control-label\">Accesorios</label>\n				<div class=\"col-sm-10\">\n					<select class=\"form-control\" name=\"accessories\" data-role=\"tagsinput\" multiple>\n						";
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
  var buffer = "", stack1, stack2, options, functionType="function", escapeExpression=this.escapeExpression, self=this, helperMissing=helpers.helperMissing;

function program1(depth0,data) {
  
  
  return "\n			Direcciones\n		";
  }

function program3(depth0,data) {
  
  
  return "\n			Dirección\n		";
  }

function program5(depth0,data) {
  
  var buffer = "", stack1, stack2;
  buffer += "\n	<div class=\"row\" data-source-index=\""
    + escapeExpression(((stack1 = ((stack1 = data),stack1 == null || stack1 === false ? stack1 : stack1.index)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" style=\"margin: 0\">\n		<hr>\n		<div class=\"col-xs-2 form-control-under\">\n			<button type=\"button\" class=\"btn btn-warning pull-right edit-address\" tabindex = \"-1\" data-source-index=\""
    + escapeExpression(((stack1 = ((stack1 = data),stack1 == null || stack1 === false ? stack1 : stack1.index)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" style=\"margin-left: 4px;\">\n				<i class=\"fa fa-pencil\"></i>\n			</button>\n			<button type=\"button\" class=\"btn btn-danger pull-right del-address\" tabindex = \"-1\" data-source-index=\""
    + escapeExpression(((stack1 = ((stack1 = data),stack1 == null || stack1 === false ? stack1 : stack1.index)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\">\n				<i class=\"fa fa-minus\"></i>\n			</button>\n		</div>\n		<div class=\"col-xs-8 form-control-under\">\n			<input type=\"text\" class=\"form-control\" value=\"";
  if (stack2 = helpers.street) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = (depth0 && depth0.street); stack2 = typeof stack2 === functionType ? stack2.call(depth0, {hash:{},data:data}) : stack2; }
  buffer += escapeExpression(stack2)
    + "\" data-name=\"street\" readonly>\n		</div>\n		<label for=\"street\" class=\"col-xs-2 text-muted control-label-under\" style=\"text-align: left; margin-bottom: 8px\">\n			Calle\n		</label>\n		<div class=\"col-xs-8 col-xs-offset-2\">\n			<input type=\"text\" class=\"form-control form-control-under\" value=\"";
  if (stack2 = helpers.city) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = (depth0 && depth0.city); stack2 = typeof stack2 === functionType ? stack2.call(depth0, {hash:{},data:data}) : stack2; }
  buffer += escapeExpression(stack2)
    + "\" data-name=\"city\" readonly>\n		</div>\n		<label for=\"city\" class=\"col-xs-2 text-muted control-label-under\">\n			Ciudad\n		</label>\n		<div class=\"col-xs-8 col-xs-offset-2\">\n			<input type=\"text\" class=\"form-control form-control-under\" value=\"";
  if (stack2 = helpers.department) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = (depth0 && depth0.department); stack2 = typeof stack2 === functionType ? stack2.call(depth0, {hash:{},data:data}) : stack2; }
  buffer += escapeExpression(stack2)
    + "\" data-name=\"department\" readonly>\n		</div>\n		<label for=\"department\" class=\"col-xs-2 text-muted control-label-under\">\n			Dep.\n		</label>\n	</div>\n";
  return buffer;
  }

  buffer += "<div class=\"row\" style=\"margin: 0\">\n	<label for=\"address\" class=\"col-xs-2 control-label\">\n		";
  options = {hash:{},inverse:self.program(3, program3, data),fn:self.program(1, program1, data),data:data};
  stack2 = ((stack1 = helpers.is || (depth0 && depth0.is)),stack1 ? stack1.call(depth0, ((stack1 = (depth0 && depth0.address)),stack1 == null || stack1 === false ? stack1 : stack1.length), ">", 1, options) : helperMissing.call(depth0, "is", ((stack1 = (depth0 && depth0.address)),stack1 == null || stack1 === false ? stack1 : stack1.length), ">", 1, options));
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n	</label>\n	<div class=\"col-xs-8\">\n		<input type=\"text\" class=\"form-control\" name=\"street\" placeholder=\"e.j: Av. 18 de Julio 123\">\n	</div>\n	<label for=\"street\" class=\"col-xs-2 control-label text-muted\" style=\"text-align: left; margin-bottom: 9px\">\n		Calle\n	</label>\n\n	<div class=\"col-xs-2 form-control-under\">\n		<button type=\"button\" class=\"btn btn-success pull-right\" id=\"add-address\" tabindex = \"-1\" data-for=\"street\">\n			<i class=\"fa fa-plus\"></i>\n		</button>\n	</div>\n	\n	<div class=\"col-xs-8\">\n		<input type=\"text\" class=\"form-control form-control-under\" name=\"city\" placeholder=\"e.j: Las Piedras\">\n	</div>\n	<label for=\"city\" class=\"col-xs-2 text-muted control-label-under\">\n		Ciudad\n	</label>\n	<div class=\"col-xs-8 col-xs-offset-2\">\n		<input type=\"text\" class=\"form-control form-control-under\" name=\"department\" placeholder=\"e.j: Artigas\">\n	</div>\n	<label for=\"department\" class=\"col-xs-2 text-muted control-label-under\">\n		Dep.\n	</label>\n</div>\n";
  stack2 = helpers.each.call(depth0, (depth0 && depth0.addresses), {hash:{},inverse:self.noop,fn:self.program(5, program5, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
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
  
  
  return "\n			<div class=\"col-xs-offset-2 col-xs-8\">\n				<button type=\"submit\" class=\"btn btn-dark-blue\">Crear</button>\n			</div>\n		";
  }

function program5(depth0,data) {
  
  
  return "\n			<div class=\"col-xs-offset-2 col-xs-8\">\n				<button id=\"update-form\" class=\"btn btn-warning\">Actualizar</button>\n			</div>\n		";
  }

  buffer += "<form class=\"form-horizontal\">\n	<div class=\"form-group\">\n		<label for=\"name\" class=\"col-xs-2 control-label\">Nombre</label>\n		<div class=\"col-xs-10\">\n			<input type=\"text\" class=\"form-control\" name=\"name\" placeholder=\"e.j: Juan Perez\" value=\"";
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
  buffer += ">Pasaporte</option>\n			</select>\n		</div>\n		<div class=\"col-xs-7\">\n			<input type=\"text\" class=\"form-control\" name=\"doc-number\" placeholder=\"e.j: 41234568\" value=\"";
  if (stack2 = helpers['doc-number']) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = (depth0 && depth0['doc-number']); stack2 = typeof stack2 === functionType ? stack2.call(depth0, {hash:{},data:data}) : stack2; }
  buffer += escapeExpression(stack2)
    + "\">\n		</div>\n	</div>\n	<div class=\"form-group\" id=\"phone-numbers\"></div>\n	<div class=\"form-group\" id=\"addresses\"></div>\n	<div class=\"form-group\">\n		<label for=\"email\" class=\"col-xs-2 control-label\">E-mail</label>\n		<div class=\"col-xs-10\">\n			<input type=\"email\" class=\"form-control\" name=\"email\" placeholder=\"e.j: ejemplo@server.com\" value=\"";
  if (stack2 = helpers.email) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = (depth0 && depth0.email); stack2 = typeof stack2 === functionType ? stack2.call(depth0, {hash:{},data:data}) : stack2; }
  buffer += escapeExpression(stack2)
    + "\">\n		</div>\n	</div>\n	<hr>\n	<div class=\"form-group\">\n		";
  stack2 = helpers.unless.call(depth0, (depth0 && depth0._id), {hash:{},inverse:self.program(5, program5, data),fn:self.program(3, program3, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n	</div>\n</form>\n";
  return buffer;
  });
this["HBS"] = this["HBS"] || {};this["HBS"]["client_index_template"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<div class=\"col-lg-12\">\n	<div class=\"row air-b\">\n		<div class=\"col-lg-12\">\n			<a href=\"#render/client/new\" class=\"btn btn-primary close-modal\">\n				<i class=\"fa fa-plus\"></i> Nuevo Cliente\n			</a>\n		</div>\n	</div>\n	<div class=\"row\">\n		<div class=\"col-lg-12\">\n			<table id=\"clients-table-";
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
  buffer += "\n			<li><i class=\"fa fa-phone fa-muted fa-fw\"></i>";
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
    + "</strong>,<br>\n	  	";
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
    + "</dt>\n	<dd>";
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
    + "\" id=\"show\" class=\"btn btn-green\" data-toggle=\"tooltip\" data-placement=\"top\" title=\"Más Información\">\n		<i class=\"fa fa-ellipsis-h fa-lg\"></i>\n	</a>\n	<a id=\"selected\" class=\"btn btn-warning hide\" data-toggle=\"tooltip\" data-placement=\"top\" title=\"Seleccionar\">\n		<i class=\"fa fa-external-link fa-lg\"></i>\n	</a>\n</td>";
  return buffer;
  });
this["HBS"] = this["HBS"] || {};this["HBS"]["client_select_modal_template"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<div id=\"client-index\"></div>";
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
  var buffer = "", stack1, stack2, options, functionType="function", escapeExpression=this.escapeExpression, self=this, helperMissing=helpers.helperMissing;

function program1(depth0,data) {
  
  
  return "\n		Telefonos\n	";
  }

function program3(depth0,data) {
  
  
  return "\n		Telefono\n	";
  }

function program5(depth0,data) {
  
  var buffer = "", stack1, stack2;
  buffer += "\n<div class=\"col-xs-8 col-xs-offset-2\" data-source-index=\""
    + escapeExpression(((stack1 = ((stack1 = data),stack1 == null || stack1 === false ? stack1 : stack1.index)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\">\n	<input type=\"text\" class=\"form-control form-control-under\" value=\"";
  if (stack2 = helpers.number) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = (depth0 && depth0.number); stack2 = typeof stack2 === functionType ? stack2.call(depth0, {hash:{},data:data}) : stack2; }
  buffer += escapeExpression(stack2)
    + "\" readonly>\n</div>​<div class=\"col-xs-2\">\n	<button type=\"button\" class=\"btn btn-danger form-control-under del-phone-number\" tabindex = \"-1\" data-phone-index=\""
    + escapeExpression(((stack1 = ((stack1 = data),stack1 == null || stack1 === false ? stack1 : stack1.index)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\">\n		<i class=\"fa fa-minus\"></i>\n	</button>\n	<button type=\"button\" class=\"btn btn-warning form-control-under edit-phone-number\" tabindex = \"-1\" data-phone-index=\""
    + escapeExpression(((stack1 = ((stack1 = data),stack1 == null || stack1 === false ? stack1 : stack1.index)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\">\n		<i class=\"fa fa-pencil\"></i>\n	</button>\n</div>\n";
  return buffer;
  }

  buffer += "<label for=\"phone\" class=\"col-xs-2 control-label\">\n	";
  options = {hash:{},inverse:self.program(3, program3, data),fn:self.program(1, program1, data),data:data};
  stack2 = ((stack1 = helpers.is || (depth0 && depth0.is)),stack1 ? stack1.call(depth0, ((stack1 = (depth0 && depth0.phones)),stack1 == null || stack1 === false ? stack1 : stack1.length), ">", 1, options) : helperMissing.call(depth0, "is", ((stack1 = (depth0 && depth0.phones)),stack1 == null || stack1 === false ? stack1 : stack1.length), ">", 1, options));
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n</label>\n<div class=\"col-xs-8\">\n	<input type=\"text\" class=\"form-control\" name=\"phone\" placeholder=\"e.j: 099123456\" data-type=\"phone-number\">\n</div>\n<div class=\"col-xs-2\">\n	<button type=\"button\" class=\"btn btn-success\" id=\"add-phone-number\" data-for=\"phone\" tabindex = \"-1\">\n		<i class=\"fa fa-plus\"></i>\n	</button>\n</div>\n";
  stack2 = helpers.each.call(depth0, (depth0 && depth0.phones), {hash:{},inverse:self.noop,fn:self.program(5, program5, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
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
this["HBS"] = this["HBS"] || {};this["HBS"]["carousel_template"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<div id=\"carousel-";
  if (stack1 = helpers.cid) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.cid); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "\" class=\"col-lg-12 carousel slide\">\n	<div class=\"row well well-sm\" style=\"border-radius: 0; margin-bottom:10px\">\n		<div class=\"col-xs-12\">\n			<h2 class=\"text-center\" style=\"margin-top: 10px\">\n				<a href=\"#carousel-";
  if (stack1 = helpers.cid) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.cid); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "\" id=\"prev-model\" class=\"btn btn-green pull-left\" data-slide=\"prev\">\n					<i class=\"fa fa-chevron-left\"></i>\n				</a>\n				";
  if (stack1 = helpers.carouselTitle) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.carouselTitle); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "\n				<button type=\"button\" class=\"btn btn-green\" data-toggle=\"collapse\" data-target=\"#range-carousel-selector\">\n					<i class=\"fa fa-bars\"></i>\n				</button>\n				<a href=\"#carousel-";
  if (stack1 = helpers.cid) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.cid); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "\" id=\"next-model\" class=\"btn btn-green pull-right\" data-slide=\"next\">\n					<i class=\"fa fa-chevron-right\"></i>\n				</a>\n			</h2>\n		</div>\n	</div>\n	<div class=\"row collapse\" id=\"range-carousel-selector\">\n		<div class=\"col-lg-12\">\n			<div class=\"range range-green\" style=\"margin: 0px 0px 10px 0px\">\n        <input type=\"range\" name=\"range\" min=\"1\" max=\"100\" value=\"1\" id=\"range-selector\">\n        <output id=\"range\">1</output>\n      </div>\n      <hr>\n		</div>\n	</div>\n	<div class=\"row\">\n		<div class=\"";
  if (stack1 = helpers.carouselClassName) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.carouselClassName); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "\">\n			<div id=\"carousel-items-";
  if (stack1 = helpers.cid) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.cid); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "\" class=\"carousel-inner\"></div>\n		</div>\n	</div>\n</div>";
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
this["HBS"] = this["HBS"] || {};this["HBS"]["modal_base_layout_template"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var stack1;
  if (stack1 = helpers.modalClass) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.modalClass); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  return escapeExpression(stack1);
  }

function program3(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n	  <div class=\"modal-header\">\n	    <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-hidden=\"true\">&times;</button>\n	    <h4 class=\"modal-title\" id=\"myModalLabel\">";
  if (stack1 = helpers.title) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.title); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "</h4>\n	  </div>\n	  ";
  return buffer;
  }

function program5(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n	  <div class=\"modal-footer\">\n	  	";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.customFooter), {hash:{},inverse:self.program(8, program8, data),fn:self.program(6, program6, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n	  </div>\n	  ";
  return buffer;
  }
function program6(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n	  		";
  if (stack1 = helpers.customFooter) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.customFooter); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "\n	  	";
  return buffer;
  }

function program8(depth0,data) {
  
  
  return "\n		    <button type=\"button\" class=\"btn btn-default\" data-dismiss=\"modal\">Cerrar</button>\n		    <button type=\"button\" class=\"btn btn-primary\">Guardar</button>\n	    ";
  }

  buffer += "<div class=\"modal-dialog ";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.modalClass), {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\">\n	<div class=\"modal-content\">\n		";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.header), {hash:{},inverse:self.noop,fn:self.program(3, program3, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n	  <div class=\"modal-body\"></div>\n	  ";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.footer), {hash:{},inverse:self.noop,fn:self.program(5, program5, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n	</div>\n</div>";
  return buffer;
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
  


  return "<div class=\"sidebar-collapse\">\n	<ul id=\"side-menu\" class=\"nav\">\n		<li class=\"text-center\">\n			<img src=\"http://placehold.it/150x150\" alr=\"User Image\" class=\"img-circle air-t-b\">\n			<p class=\"text-muted\">\n				<i class=\"fa fa-user\"></i> Guzmán <strong>Monné</strong>\n			</p>\n		</li>\n		<li class=\"sidebar-search\"></li>\n		<li>\n			<a href=\"#\">\n				<i class=\"fa fa-dashboard fa-fw\"></i> Dashboard\n			</a>\n		</li>\n		<li>\n			<a href=\"#\">\n				<i class=\"fa fa-users fa-fw\"></i> Clientes \n				<span class=\"fa arrow\"></span>\n			</a>\n			<ul class=\"nav nav-second-level\">\n				<li>				\n					<a href=\"#render/client/new\">\n						<i class=\"fa fa-plus fa-fw\"></i> Nuevo\n					</a>\n				</li>\n				<li>				\n					<a href=\"#render/client/index\">\n						<i class=\"fa fa-list-alt fa-fw\"></i> Lista\n					</a>\n				</li>\n			</ul>\n		</li>\n		<li>\n			<a href=\"#\">\n				<i class=\"fa fa-clipboard fa-fw\"></i> Ordenes de Servicio\n				<span class=\"fa arrow\"></span>\n			</a>\n			<ul class=\"nav nav-second-level\">\n				<li>\n					<a href=\"#render/service_request/new\">\n						<i class=\"fa fa-plus fa-fw\"></i> Nuevo\n					</a>\n				</li>\n				<li>\n					<a href=\"#render/service_request/index\">\n						<i class=\"fa fa-list-alt fa-fw\"></i> Lista\n					</a>\n				</li>\n			</ul>\n		</li>\n		<li>\n			<a href=\"#\">\n				<i class=\"fa fa-desktop fa-fw\"></i> Equipos \n				<span class=\"fa arrow\"></span>\n			</a>\n			<ul class=\"nav nav-second-level\">\n				<li>				\n					<a href=\"#render/appliance/index\">\n						<i class=\"fa fa-list-alt fa-fw\"></i> Lista\n					</a>\n				</li>\n				<li>\n					<a href=\"#\" class=\"third-level\">\n						<i class=\"fa fa-ellipsis-h fa-fw\"></i> Modelos\n						<span class=\"fa arrow\"></span>\n					</a>\n					<ul class=\"nav nav-third-level\">\n						<li>\n							<a href=\"#render/model/new\">\n								<i class=\"fa fa-plus fa-fw\"></i> Nuevo\n							</a>\n						</li>\n						<li>\n							<a href=\"#render/model/index\">\n								<i class=\"fa fa-list-alt fa-fw\"></i> Lista\n							</a>\n						</li>\n					</ul>\n				</li>\n			</ul>\n		</li>\n		<li>\n			<a href=\"#\">\n				<i class=\"fa fa-user fa-fw\"></i> Usuarios\n				<span class=\"fa arrow\"></span>\n			</a>\n			<ul class=\"nav nav-second-level\">\n				<li>\n					<a href=\"#render/user/new\">\n						<i class=\"fa fa-plus fa-fw\"></i> Nuevo\n					</a>\n				</li>\n				<li>\n					<a href=\"#render/user/index\">\n						<i class=\"fa fa-list-alt fa-fw\"></i> Lista\n					</a>\n				</li>\n			</ul>\n		</li>\n	</ul>\n</div>";
  });
this["HBS"] = this["HBS"] || {};this["HBS"]["tabs_template"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, self=this, functionType="function", escapeExpression=this.escapeExpression;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n    <li ";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.active), {hash:{},inverse:self.noop,fn:self.program(2, program2, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += ">\n    	<a href=\"#";
  if (stack1 = helpers.href) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.href); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "\" data-toggle=\"tab\" id=\"";
  if (stack1 = helpers.id) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.id); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "\">\n    		";
  if (stack1 = helpers.title) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.title); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "\n    	</a>\n    </li>\n  ";
  return buffer;
  }
function program2(depth0,data) {
  
  
  return "class=\"active\"";
  }

function program4(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n    <div class=\"tab-pane fade in ";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.active), {hash:{},inverse:self.noop,fn:self.program(5, program5, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += " ";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0['class']), {hash:{},inverse:self.noop,fn:self.program(7, program7, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\" id=\"";
  if (stack1 = helpers.href) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.href); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "\"></div>\n  ";
  return buffer;
  }
function program5(depth0,data) {
  
  
  return "active";
  }

function program7(depth0,data) {
  
  var stack1;
  if (stack1 = helpers['class']) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0['class']); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  return escapeExpression(stack1);
  }

  buffer += "<ul id=\"";
  if (stack1 = helpers.modelName) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.modelName); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "-tabs\" class=\"nav nav-tabs\">\n  ";
  stack1 = helpers.each.call(depth0, (depth0 && depth0.tab), {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n</ul>\n<div id=\"";
  if (stack1 = helpers.modelName) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.modelName); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "-tab-content\" class=\"tab-content\">\n  ";
  stack1 = helpers.each.call(depth0, (depth0 && depth0.tab), {hash:{},inverse:self.noop,fn:self.program(4, program4, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n</div>";
  return buffer;
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
this["HBS"] = this["HBS"] || {};this["HBS"]["model_details_template"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, stack2, options, functionType="function", escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing;


  buffer += "<div class=\"col-lg-12\">\n  <span class=\"pull-right\" style=\"margin-top: 20px\">\n    <a href=\"#render/model/index\" class=\"pull-right text-muted\">\n      <i class=\"fa fa-list fa-3x\"></i>\n    </a>\n  </span>\n  <h1>\n    Modelo: ";
  if (stack1 = helpers.model) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.model); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "\n    <span class=\"pull-right label ";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.statusClass || (depth0 && depth0.statusClass)),stack1 ? stack1.call(depth0, (depth0 && depth0.status), options) : helperMissing.call(depth0, "statusClass", (depth0 && depth0.status), options)))
    + "\">";
  if (stack2 = helpers.status) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = (depth0 && depth0.status); stack2 = typeof stack2 === functionType ? stack2.call(depth0, {hash:{},data:data}) : stack2; }
  buffer += escapeExpression(stack2)
    + "</span>\n  </h1>\n  <div class=\"row\">\n  	<div class=\"col-xs-2\">\n  		<ul class=\"list-unstyled\">\n  			<li><strong>Marca</strong></li>\n  			<li><strong>Categoría</strong></li>\n  			<li><strong>Subcategoría</strong></li>\n  		</ul>\n  	</div>\n  	<div class=\"col-xs-4\">\n  		<ul class=\"list-unstyled\">\n	  		<li>";
  if (stack2 = helpers.brand) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = (depth0 && depth0.brand); stack2 = typeof stack2 === functionType ? stack2.call(depth0, {hash:{},data:data}) : stack2; }
  buffer += escapeExpression(stack2)
    + "</li>\n	  		<li>";
  if (stack2 = helpers.category) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = (depth0 && depth0.category); stack2 = typeof stack2 === functionType ? stack2.call(depth0, {hash:{},data:data}) : stack2; }
  buffer += escapeExpression(stack2)
    + "</li>\n	  		<li>";
  if (stack2 = helpers.subcategory) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = (depth0 && depth0.subcategory); stack2 = typeof stack2 === functionType ? stack2.call(depth0, {hash:{},data:data}) : stack2; }
  buffer += escapeExpression(stack2)
    + "</li>\n  		</ul>\n  	</div>\n  </div>\n  <hr style=\"margin: 0\">\n  <div class=\"row\">\n    <div class=\"col-sm-6\">\n        <h3>Equipos</h3>\n    </div>\n  </div>\n  <div id=\"model-appliances\"></div>\n</div>\n<div class=\"col-lg-12\">\n<hr>\n  <div class=\"row\">\n    <div class=\"col-sm-6\">\n      <small>\n        Creado el ";
  if (stack2 = helpers.createdAt) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = (depth0 && depth0.createdAt); stack2 = typeof stack2 === functionType ? stack2.call(depth0, {hash:{},data:data}) : stack2; }
  buffer += escapeExpression(stack2)
    + " por ";
  if (stack2 = helpers.createdBy) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = (depth0 && depth0.createdBy); stack2 = typeof stack2 === functionType ? stack2.call(depth0, {hash:{},data:data}) : stack2; }
  buffer += escapeExpression(stack2)
    + "\n      </small>\n    </div>\n    <div class=\"col-sm-6 text-right\">\n      <small>\n        Modificado el ";
  if (stack2 = helpers.updatedAt) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = (depth0 && depth0.updatedAt); stack2 = typeof stack2 === functionType ? stack2.call(depth0, {hash:{},data:data}) : stack2; }
  buffer += escapeExpression(stack2)
    + " por ";
  if (stack2 = helpers.updatedBy) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = (depth0 && depth0.updatedBy); stack2 = typeof stack2 === functionType ? stack2.call(depth0, {hash:{},data:data}) : stack2; }
  buffer += escapeExpression(stack2)
    + "\n      </small>\n    </div>\n  </div>\n</div>";
  return buffer;
  });
this["HBS"] = this["HBS"] || {};this["HBS"]["model_form_template"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<div class=\"col-lg-12\">\n	<form class=\"form-horizontal\">\n		\n		\n		\n		<div class=\"row\">\n			<div class=\"col-md-6\">\n				<div class=\"form-group\">\n					<label for=\"brand\" class=\"col-sm-3 control-label\">Marca</label>\n					<div class=\"col-sm-9\">\n						<input type=\"text\" class=\"form-control\" name=\"brand\" placeholder=\"e.j: Punktal\" value=\"";
  if (stack1 = helpers.brand) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.brand); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "\">\n					</div>\n				</div>\n				<div class=\"form-group\">\n					<label for=\"model\" class=\"col-sm-3 control-label\">Modelo</label>\n					<div class=\"col-sm-9\">\n						<input type=\"text\" class=\"form-control\" name=\"model\" placeholder=\"e.j: PKT1020\" value=\"";
  if (stack1 = helpers.model) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.model); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "\">\n					</div>\n				</div>\n			</div>\n			<div class=\"col-md-6\">\n				<div class=\"form-group\">\n					<label for=\"category\" class=\"col-sm-4 control-label\">Categoría</label>\n					<div class=\"col-sm-8\">\n						<input type=\"text\" class=\"form-control\" name=\"category\" placeholder=\"e.j: Electrodomestico\" value=\"";
  if (stack1 = helpers.category) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.category); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "\">\n					</div>\n				</div>\n				<div class=\"form-group\">\n					<label for=\"subcategory\" class=\"col-sm-4 control-label\">Subcategoría</label>\n					<div class=\"col-sm-8\">\n						<input type=\"text\" class=\"form-control\" name=\"subcategory\" placeholder=\"e.j: Plancha\" value=\"";
  if (stack1 = helpers.subcategory) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.subcategory); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "\">\n					</div>\n				</div>\n			</div>\n		</div>\n\n		\n		<div class=\"row\">\n			<div class=\"col-lg-12\">\n				<hr style=\"margin-top: 0;\">\n			</div>\n		</div>\n		\n\n		<div class=\"row\" style=\"border-radius: 0; margin-bottom: 0\">\n	    <div class=\"col-xs-12\">\n	      <button type=\"submit\" id=\"save-model\" class=\"btn btn-primary\">\n	      	<i class=\"fa fa-save\"></i>\n	      	 Guardar\n	      </button>\n	      <button type=\"submit\" id=\"save-changes-model\" class=\"btn btn-warning hide\">\n	      	<i class=\"fa fa-save\"></i>\n	      	 Guardar Cambios\n	      </button>\n	      <button id=\"edit-model\" class=\"btn btn-primary\">\n	      	<i class=\"fa fa-pencil\"></i>\n	      	 Editar\n	      </button>\n	      <button id=\"reset-model\" class=\"btn btn-inverse hide pull-right\">\n	      	<i class=\"fa fa-reply\"></i>\n	      	 Reestablecer\n	      </button>\n	    </div>\n		</div>\n	</form>\n</div>";
  return buffer;
  });
this["HBS"] = this["HBS"] || {};this["HBS"]["model_index_template"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<div class=\"col-lg-12\">\n	<div class=\"row air-b\">\n		<div class=\"col-lg-12\">\n			<a href=\"#render/model/new\" class=\"btn btn-primary close-modal\">\n				<i class=\"fa fa-plus\"></i> Nuevo Modelo\n			</a>\n		</div>\n	</div>\n	<div class=\"row\">\n		<div class=\"col-lg-12\">\n			<table id=\"models-table-";
  if (stack1 = helpers.timestamp) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.timestamp); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "\" class=\"table table-striped table-bordered table-hover table-office\" aria-describedby=\"models-table-info\">\n				<thead>\n					<tr>\n						<th>Modelo</th>\n						<th>Marca</th>\n						<th>Categoría</th>\n						<th>Subcategoría</th>\n						<th class=\"text-center\"><i class=\"fa fa-wrench\"></i></th>\n					</tr>\n				</thead>\n				<tbody role=\"alert\" aria-live=\"polite\" aria-relevant=\"all\" id=\"models\">\n				</tbody>\n			</table>\n		</div>\n	</div>\n</div>\n			";
  return buffer;
  });
this["HBS"] = this["HBS"] || {};this["HBS"]["model_new_template"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "";


  return buffer;
  });
this["HBS"] = this["HBS"] || {};this["HBS"]["model_row_template"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<td>";
  if (stack1 = helpers.model) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.model); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "</td>\n<td>";
  if (stack1 = helpers.brand) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.brand); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "</td>\n<td>";
  if (stack1 = helpers.category) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.category); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "</td>\n<td>";
  if (stack1 = helpers.subcategory) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.subcategory); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "</td>\n<td class=\"center-vh\">\n	<a href=\"#render/model/show/";
  if (stack1 = helpers._id) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0._id); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "\" class=\"btn btn-green\" data-toggle=\"tooltip\" data-placement=\"top\" title=\"Más Información\" id=\"show\">\n		<i class=\"fa fa-ellipsis-h fa-lg\"></i>\n	</a>\n	<a id=\"selected\" class=\"btn btn-warning hide\" data-toggle=\"tooltip\" data-placement=\"top\" title=\"Seleccionar\">\n		<i class=\"fa fa-external-link fa-lg\"></i>\n	</a>\n</td>";
  return buffer;
  });
this["HBS"] = this["HBS"] || {};this["HBS"]["model_select_modal_template"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<div id=\"model-index\"></div>";
  });
this["HBS"] = this["HBS"] || {};this["HBS"]["service_request_details_template"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, stack2, options, functionType="function", escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n    <div class=\"col-sm-6\">\n      <h3 class=\"pull-right\">\n        Remito: \n         <span class=\"text-primary\">";
  if (stack1 = helpers.invoiceNumber) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.invoiceNumber); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "</span>\n       </h3>\n    </div>\n    ";
  return buffer;
  }

  buffer += "<div class=\"col-lg-12\">\n  <h1>\n    Cliente: \n     <a href=\"#render/client/show/";
  if (stack1 = helpers.client_id) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.client_id); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "\">\n      ";
  if (stack1 = helpers.client_name) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.client_name); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "\n    </a>\n    <span class=\"pull-right label ";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.statusClass || (depth0 && depth0.statusClass)),stack1 ? stack1.call(depth0, (depth0 && depth0.status), options) : helperMissing.call(depth0, "statusClass", (depth0 && depth0.status), options)))
    + "\">";
  if (stack2 = helpers.status) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = (depth0 && depth0.status); stack2 = typeof stack2 === functionType ? stack2.call(depth0, {hash:{},data:data}) : stack2; }
  buffer += escapeExpression(stack2)
    + "</span>\n  </h1>\n  <hr style=\"margin: 0\">\n  <div class=\"row\">\n    <div class=\"col-sm-6\">\n        <h3>Equipos</h3>\n    </div>\n    ";
  stack2 = helpers['if'].call(depth0, (depth0 && depth0.invoiceNumber), {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n  </div>\n  <div id=\"service-request-appliances\"></div>\n</div>\n<div class=\"col-lg-12\">\n<hr>\n  <div class=\"row\">\n    <div class=\"col-sm-6\">\n      <small>\n        Creado el ";
  if (stack2 = helpers.createdAt) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = (depth0 && depth0.createdAt); stack2 = typeof stack2 === functionType ? stack2.call(depth0, {hash:{},data:data}) : stack2; }
  buffer += escapeExpression(stack2)
    + " por ";
  if (stack2 = helpers.createdBy) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = (depth0 && depth0.createdBy); stack2 = typeof stack2 === functionType ? stack2.call(depth0, {hash:{},data:data}) : stack2; }
  buffer += escapeExpression(stack2)
    + "\n      </small>\n    </div>\n    <div class=\"col-sm-6 text-right\">\n      <small>\n        Modificado el ";
  if (stack2 = helpers.updatedAt) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = (depth0 && depth0.updatedAt); stack2 = typeof stack2 === functionType ? stack2.call(depth0, {hash:{},data:data}) : stack2; }
  buffer += escapeExpression(stack2)
    + " por ";
  if (stack2 = helpers.updatedBy) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = (depth0 && depth0.updatedBy); stack2 = typeof stack2 === functionType ? stack2.call(depth0, {hash:{},data:data}) : stack2; }
  buffer += escapeExpression(stack2)
    + "\n      </small>\n    </div>\n  </div>\n</div>";
  return buffer;
  });
this["HBS"] = this["HBS"] || {};this["HBS"]["service_request_form_template"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  
  return "readonly";
  }

function program3(depth0,data) {
  
  
  return "disabled";
  }

function program5(depth0,data) {
  
  
  return "\n			<div class=\"col-xs-offset-10 col-xs-2\">\n				<button type=\"submit\" class=\"btn btn-dark-blue pull-right\" disabled>Crear</button>\n			</div>\n		";
  }

function program7(depth0,data) {
  
  
  return "\n			<div class=\"col-xs-offset-10 col-xs-2\">\n				<button id=\"update-form\" class=\"btn btn-warning pull-right\">Actualizar</button>\n			</div>\n		";
  }

  buffer += "<div class=\"form-horizontal\">\n	<div class=\"row\">\n		<div class=\"col-lg-offset-1 col-lg-6 col-md-8 col-xs-8\">\n			<div class=\"form-group\">\n				<label for=\"client_name\" class=\"col-xs-2 control-label\">Cliente</label>\n				<div class=\"col-xs-8\">\n					<input type=\"text\" class=\"form-control\" name=\"client_name\" placeholder=\"Seleccione un Cliente\" value=\"";
  if (stack1 = helpers.client_name) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.client_name); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "\" readonly>\n				</div>\n				<div class=\"col-xs-2\">\n					<button class=\"btn btn-info\" data-toggle=\"tooltip\" data-placement=\"top\" title=\"Buscar Cliente\" id=\"select-client\">\n						<i class=\"fa fa-search\"></i>\n					</button>\n				</div>\n			</div>\n		</div>\n		<div class=\"col-lg-3 col-md-4 col-xs-4\">\n			<div class=\"form-group\">\n				<label for=\"invoiceNumber\" class=\"col-xs-4 control-label\">Remito</label>\n				<div class=\"col-xs-8\">\n					<input type=\"text\" class=\"form-control\" name=\"invoiceNumber\" placeholder=\"e.j: A142985\" value=\"";
  if (stack1 = helpers.invoiceNumber) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.invoiceNumber); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "\" ";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.invoiceNumber), {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += ">\n				</div>\n			</div>\n		</div>\n		<div class=\"col-lg-6 col-md-6\" style=\"display: none;\">\n			<div class=\"form-group\">\n				<label for=\"client_id\" class=\"col-xs-4 control-label\">ID Cliente</label>\n				<div class=\"col-xs-8\">\n					<input type=\"text\" class=\"form-control\" name=\"client_id\" placeholder=\"Juan Perez\" value=\"";
  if (stack1 = helpers.client_id) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.client_id); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "\" ";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.client_id), {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += ">\n				</div>\n			</div>\n		</div>\n	</div>\n	<hr style=\"margin-top: 0\">\n	<div class=\"row\">\n		<div class=\"col-lg-offset-1 col-lg-10 col-md-12\">\n			<div class=\"row\" id=\"appliance-views\"></div>\n		</div>\n		<div class=\"col-lg-offset-1 col-lg-10 col-md-12\">\n			<button ";
  stack1 = helpers.unless.call(depth0, (depth0 && depth0.client_id), {hash:{},inverse:self.noop,fn:self.program(3, program3, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += " class=\"btn btn-success\" id=\"single-appliance\">\n				<i class=\"fa fa-plus\"></i> Nuevo Equipo\n			</button>\n			<button ";
  stack1 = helpers.unless.call(depth0, (depth0 && depth0.client_id), {hash:{},inverse:self.noop,fn:self.program(3, program3, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += " class=\"btn btn-success\" id=\"multiple-appliance\">\n				<i class=\"fa fa-table\"></i> Carga Masiva\n			</button>\n			<hr style=\"margin-bottom: 0;\">\n		</div>\n	</div>\n	<div class=\"form-group\" style=\"margin-top: 10px;\">\n		";
  stack1 = helpers.unless.call(depth0, (depth0 && depth0._id), {hash:{},inverse:self.program(7, program7, data),fn:self.program(5, program5, data),data:data});
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
    + "\" class=\"table table-striped table-bordered table-hover table-office dataTable\" aria-describedby=\"service_requests-table-info\">\n				<thead>\n					<tr>\n						<th>ID</th>\n						<th>Cliente</th>\n						<th>Remito</th>\n						<th>Cant. de Equipos</th>\n						<th>Estado</th>\n						<th>Creado</th>\n						<th>Finalizado</th>\n						<th class=\"text-center\"><i class=\"fa fa-wrench\"></i></th>\n					</tr>\n				</thead>\n				<tbody role=\"alert\" aria-live=\"polite\" aria-relevant=\"all\" id=\"service_requests\">\n				</tbody>\n			</table>\n		</div>\n	</div>\n</div>";
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
    + "</td>\n<td>";
  if (stack1 = helpers.invoiceNumber) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.invoiceNumber); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "</td>\n<td class=\"text-center\">";
  if (stack1 = helpers.appliancesCount) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.appliancesCount); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
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
this["HBS"] = this["HBS"] || {};this["HBS"]["user_form_template"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  
  return " selected ";
  }

  buffer += "<div class=\"col-lg-12\">\n	<form class=\"form-horizontal\">\n		\n		\n		\n		<div class=\"row\">\n			<div class=\"col-md-6\">\n				<div class=\"form-group\">\n					<label for=\"name\" class=\"col-sm-3 control-label\">Nombre</label>\n					<div class=\"col-sm-9\">\n						<input type=\"text\" class=\"form-control\" name=\"name\" placeholder=\"e.j: Juan Perez\" value=\"";
  if (stack1 = helpers.name) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.name); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "\">\n					</div>\n				</div>\n			</div>\n			<div class=\"col-md-6\">\n				<div class=\"form-group\">\n					<label for=\"email\" class=\"col-sm-3 control-label\">Email</label>\n					<div class=\"col-sm-9\">\n						<input type=\"email\" class=\"form-control\" name=\"email\" placeholder=\"e.j: ejemplo@gotmail.com\" value=\"";
  if (stack1 = helpers.email) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.email); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "\">\n					</div>\n				</div>\n			</div>\n		</div>\n		\n		<div class=\"row\">\n			<div class=\"col-lg-12\">\n				<hr style=\"margin-top: 10px;\">\n			</div>\n		</div>\n		\n		<div class=\"row\">\n			<div class=\"col-md-6\">\n				<div class=\"checkbox\">\n					<label for=\"admin\" class=\"col-sm-12\">\n						<input type=\"checkbox\" name=\"admin\" ";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.admin), {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "> Administrador\n					</label>\n				</div>\n			</div>\n			<div class=\"col-md-6\">\n				<div class=\"checkbox\">\n					<label for=\"tech\" class=\"col-sm-12\">\n						<input type=\"checkbox\" name=\"tech\" ";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.tech), {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "> Tecnico\n					</label>\n				</div>\n			</div>\n		</div>\n\n		\n		<div class=\"row\">\n			<div class=\"col-lg-12\">\n				<hr style=\"margin-top: 10px;\">\n			</div>\n		</div>\n		\n\n		<div class=\"row\" style=\"border-radius: 0; margin-bottom: 0\">\n	    <div class=\"col-xs-12\">\n	      <button type=\"submit\" id=\"save-model\" class=\"btn btn-primary\">\n	      	<i class=\"fa fa-save\"></i>\n	      	 Guardar\n	      </button>\n	    </div>\n		</div>\n	</form>\n</div>";
  return buffer;
  });
this["HBS"] = this["HBS"] || {};this["HBS"]["user_index_template"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<div class=\"col-lg-12\">\n	<div class=\"row air-b\">\n		<div class=\"col-lg-12\">\n			<a href=\"#render/user/new\" class=\"btn btn-primary\">\n				<i class=\"fa fa-plus\"></i> Nuevo Usuario\n			</a>\n		</div>\n	</div>\n	<div class=\"row\">\n		<div class=\"col-lg-12\">\n			<table id=\"users-table-";
  if (stack1 = helpers.timestamp) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.timestamp); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "\" class=\"table table-striped table-bordered table-hover table-office\" aria-describedby=\"users-table-info\">\n				<thead>\n					<tr>\n						<th>Datos</th>\n						<th>Permisos</th>\n						<th class=\"text-center\"><i class=\"fa fa-wrench\"></i></th>\n					</tr>\n				</thead>\n				<tbody role=\"alert\" aria-live=\"polite\" aria-relevant=\"all\" id=\"users\">\n				</tbody>\n			</table>\n		</div>\n	</div>\n</div>\n			";
  return buffer;
  });
this["HBS"] = this["HBS"] || {};this["HBS"]["user_row_template"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, stack2, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  
  return "<dd>Administrador</dd>";
  }

function program3(depth0,data) {
  
  
  return "<dd>Tecnico</dd>";
  }

  buffer += "<td>\n	<dd><i class=\"fa fa-user fa-fw\"></i> ";
  if (stack1 = helpers.name) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.name); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "</dd>\n	<dd><i class=\"fa fa-envelope fa-fw\"></i> ";
  if (stack1 = helpers.email) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.email); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "</dd>\n</td>\n<td>\n	<dt>Roles</dt>\n	";
  stack2 = helpers['if'].call(depth0, ((stack1 = ((stack1 = (depth0 && depth0.permissions)),stack1 == null || stack1 === false ? stack1 : stack1.roles)),stack1 == null || stack1 === false ? stack1 : stack1.isAdmin), {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n	";
  stack2 = helpers['if'].call(depth0, ((stack1 = ((stack1 = (depth0 && depth0.permissions)),stack1 == null || stack1 === false ? stack1 : stack1.roles)),stack1 == null || stack1 === false ? stack1 : stack1.isTech), {hash:{},inverse:self.noop,fn:self.program(3, program3, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n</td>\n<td class=\"center-vh\">\n	<a href=\"#render/model/show/";
  if (stack2 = helpers._id) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = (depth0 && depth0._id); stack2 = typeof stack2 === functionType ? stack2.call(depth0, {hash:{},data:data}) : stack2; }
  buffer += escapeExpression(stack2)
    + "\" class=\"btn btn-green\" data-toggle=\"tooltip\" data-placement=\"top\" title=\"Más Información\" id=\"show\">\n		<i class=\"fa fa-ellipsis-h fa-lg\"></i>\n	</a>\n	<a id=\"selected\" class=\"btn btn-warning hide\" data-toggle=\"tooltip\" data-placement=\"top\" title=\"Seleccionar\">\n		<i class=\"fa fa-external-link fa-lg\"></i>\n	</a>\n</td>";
  return buffer;
  });