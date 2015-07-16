Ext.define('Trkvue.view.fleet.FleetItem', {
	
	extend : 'Ext.tab.Panel',
	
	requires : [ 'Trkvue.view.fleet.FleetForm'],
	
	mixins : { spotlink : 'Frx.mixin.view.SpotLink' },
	
	xtype : 'trkvue_fleet_item',
	
	title : T('menu.Fleet'),
	
	items : [ 
		{ xtype : 'trkvue_fleet_form' }
	]
});