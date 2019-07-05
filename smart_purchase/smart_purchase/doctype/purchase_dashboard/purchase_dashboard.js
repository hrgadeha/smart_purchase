// Copyright (c) 2019, Hardik Gadesha and contributors
// For license information, please see license.txt

frappe.ui.form.on('Purchase Dashboard', {
	refresh: function(frm) {
		var help_content =
			`<br><br>
			<table class="table table-bordered" style="background-color: #f9f9f9;">
				<tr><td>
					<h4>
						<i class="fa fa-hand-right"></i> 
						${__("Notes")}:
					</h4>
					<ul>
						<li>
							${__("Supplier should be entered in supplier table under item group")}
						</li>
						<li>
							${__("Item Should have saftey stock value and only thoes item will shown here which has actual qty < saftey stock")}
						</li>
						<li>
							${__("You have to check *Send RFQ* check box in supplier table to create RFQ for this supplier")}
						</li>
						<li>
							${__("You have to entre RFQ Qty and use check box *ADD* to create RFQ for selected items")}
						</li>
						<li>
							${__("On Save, 1 RFQ will be crated based on selected supplier and items")}
						</li>
					</ul>
				</td></tr>
			</table>`;

		set_field_options("details", help_content);

	}
});

frappe.ui.form.on("Purchase Dashboard", {    
onload: function(me) {	
		cur_frm.clear_table("purchase_dashboard_table");
		cur_frm.clear_table("purchase_dashboard_supplier");
		cur_frm.refresh_fields();
		me.set_value("item_group","")		
    		me.page.sidebar.remove(); // this removes the sidebar
    		me.page.wrapper.find(".layout-main-section-wrapper").removeClass("col-md-10"); // this removes class "col-md-10" from content block, which sets width to 83%
    	} 
});

frappe.ui.form.on("Purchase Dashboard", {
  get_details: function(frm) {
	if(frm.doc.item_group){
	cur_frm.clear_table("purchase_dashboard_table");
	cur_frm.clear_table("purchase_dashboard_supplier");
	cur_frm.refresh_fields();
	
    frappe.call({
    "method": "smart_purchase.smart_purchase.doctype.purchase_dashboard.purchase_dashboard.insert_data",
args: {
doctype: "Purchase Dashboard",
item_group: frm.doc.item_group
},
callback:function(r){
	var len=r.message.length;
	console.log(r.message)
	for (var i=0;i<len;i++){
	        var row = frm.add_child("purchase_dashboard_table");
		row.item_code = r.message[i][0];
		row.safety_stock = r.message[i][1];
		row.actual_qty = r.message[i][2];
		row.uom = r.message[i][3];
	}
		cur_frm.refresh();
	}
    });

	frappe.call({
    "method": "smart_purchase.smart_purchase.doctype.purchase_dashboard.purchase_dashboard.insert_supplier",
args: {
doctype: "Purchase Dashboard",
item_group: frm.doc.item_group
},
callback:function(r){
	var len=r.message.length;
	console.log(r.message)
	for (var i=0;i<len;i++){
	        var row = frm.add_child("purchase_dashboard_supplier");
		row.supplier = r.message[i][0];
	}
		cur_frm.refresh();
	}
    });

   }
}
});
