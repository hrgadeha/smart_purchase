# -*- coding: utf-8 -*-
# Copyright (c) 2019, Hardik Gadesha and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from datetime import date
from frappe import msgprint
from frappe.model.document import Document

class PurchaseDashboard(Document):
	def validate(doc):
		supplier = []
		for c in doc.purchase_dashboard_supplier:
			if c.send_rfq == 1:
				supplier_li = {"supplier": c.supplier}
				supplier.append(supplier_li)
		items = []
		for d in doc.purchase_dashboard_table:
			if d.add == 1:
				item_li = {"item_code": d.item_code,"qty": d.rfq_qty,"warehouse":'Finished Goods - B',"description":d.item_code,"uom":d.uom}
				items.append(item_li)
		frappe.msgprint("Request for Quotation Genrated")
		rfq = frappe.get_doc({
		"doctype": "Request for Quotation", 
		"transaction_date": date.today(),
		"suppliers": supplier,
		"items": items,
		"status":"Draft",
		"message_for_supplier":"Please supply the specified items at the best possible rates"
		})
		rfq.insert(ignore_permissions=True)
		rfq.save()


@frappe.whitelist(allow_guest=True)
def insert_supplier(doctype,item_group=None ):
	query="select obj2.supplier from `tabItem` obj1, `tabItem Supplier` obj2 where obj1.name = obj2.parent and obj1.item_group ='"+str(item_group)+"';"
	li=[]
	dic=frappe.db.sql(query, as_dict=True)
	for i in dic:	
		supplier=i['supplier']
		li.append([supplier])  		
	return li

@frappe.whitelist(allow_guest=True)
def insert_data(doctype,item_group=None ):
	query="select item_code,safety_stock,(select actual_qty from `tabBin` where item_code = `tabItem`.item_code and warehouse = 'Finished Goods - B') as total_stock, stock_uom from `tabItem` where (select actual_qty from `tabBin` where item_code = `tabItem`.item_code and warehouse = 'Finished Goods - B') < safety_stock and item_group ='"+str(item_group)+"';"
	li=[]
	dic=frappe.db.sql(query, as_dict=True)
	for i in dic:	
		item_code,safety_stock,total_stock,stock_uom=i['item_code'],i['safety_stock'],i['total_stock'],i['stock_uom']
		li.append([item_code,safety_stock,total_stock,stock_uom])  		
	return li
