Ext.define('Trkvue.view.fleet_group.FleetGroupItem', {
	
	extend : 'Ext.tab.Panel',
	
	requires : [ 
		'Trkvue.view.fleet_group.FleetGroupForm',
		'Trkvue.view.fleet_group.FleetGroupGeofenceList'
	],
	
	mixins : { spotlink : 'Frx.mixin.view.SpotLink' },
	
	xtype : 'trkvue_fleet_group_item',
	
	title : T('menu.FleetGroup'),
	
	items : [ 
		{ xtype : 'trkvue_fleet_group_form' },
		{ xtype : 'trkvue_fleet_group_geofence_list' }
	]
});