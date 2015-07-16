Ext.define('Trkvue.view.driver.DriverForm', {
	
	extend : 'Ext.form.Panel',
	
	xtype : 'trkvue_driver_form',
	
	title : T('title.basic_info'),
		
	autoScroll : true,
	
	defaults : { xtype : 'textfield', anchor : '100%' },
	
	items : [
		{ name : 'id', fieldLabel : T('label.id'), hidden : true },
		{ name : 'code', fieldLabel : T('label.code'), allowBlank : false, maxLength : 32 },
		{ name : 'name', fieldLabel : T('label.name'), allowBlank : false, maxLength : 64 },
		{ name : 'social_id', fieldLabel : T('label.social_id'), maxLength : 32 },
		{ name : 'email', fieldLabel : T('label.email'), maxLength : 64 },
		{ name : 'title', fieldLabel : T('label.title'), maxLength : 32 },
		{ name : 'division', fieldLabel : T('label.division'), maxLength : 32 },
		{ name : 'phone_no', fieldLabel : T('label.phone'), maxLength : 32 },
		{ name : 'mobile_no', fieldLabel : T('label.mobile'), maxLength : 32 },
		{ name : 'address', fieldLabel : T('label.address'), maxLength : 255 },
		{ name : 'img', fieldLabel : T('label.url'), maxLength : 255 },
		{ xtype : 'timestamp' }
	],
	
	dockedItems: [ {
		xtype: 'controlbar',
		items: ['->', 'list', 'save', 'delete']
	} ]
});