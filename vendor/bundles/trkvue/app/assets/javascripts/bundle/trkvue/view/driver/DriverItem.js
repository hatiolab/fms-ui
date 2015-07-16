Ext.define('Trkvue.view.driver.DriverItem', {
	
	extend : 'Ext.tab.Panel',
	
	requires : [ 'Trkvue.view.driver.DriverForm'],
	
	mixins : { spotlink : 'Frx.mixin.view.SpotLink' },
	
	xtype : 'trkvue_driver_item',
	
	title : T('menu.Driver'),
	
	items : [ 
		{ xtype : 'trkvue_driver_form' },
		{ xtype : 'base_attachment_form' }
	]
});