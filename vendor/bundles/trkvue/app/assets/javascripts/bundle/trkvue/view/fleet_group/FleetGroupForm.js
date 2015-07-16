Ext.define('Trkvue.view.fleet_group.FleetGroupForm', {
	
	extend : 'Ext.form.Panel',
	
	xtype : 'trkvue_fleet_group_form',
	
	title : T('title.basic_info'),
		
	autoScroll : true,
	
	defaults : { xtype : 'textfield', anchor : '100%' },
	
	items : [
		{ name : 'id', fieldLabel : T('label.id'), hidden : true },
		{ name : 'name', fieldLabel : T('label.name'), allowBlank : false, maxLength : 32 },
		{ name : 'description', fieldLabel : T('label.description'), maxLength : 255 },
		{ xtype : 'timestamp' }
	],
	
	dockedItems: [ {
		xtype: 'controlbar',
		items: ['->', 'list', 'save', 'delete']
	} ]
});