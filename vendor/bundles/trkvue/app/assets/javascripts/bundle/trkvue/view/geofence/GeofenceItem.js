Ext.define('Trkvue.view.geofence.GeofenceItem', {
	
	extend : 'Ext.tab.Panel',
	
	requires : [ 
		'Trkvue.view.geofence.GeofenceForm',
		'Trkvue.view.geofence.GeofenceFleetGroupList',
		'Trkvue.view.geofence.GeofenceMap'
	],
	
	mixins : { spotlink : 'Frx.mixin.view.SpotLink' },
	
	xtype : 'trkvue_geofence_item',
	
	title : T('menu.Geofence'),
	
	items : [ 
		{ xtype : 'trkvue_geofence_form' },
		{ xtype : 'trkvue_geofence_fleet_group_list' },
		{ xtype : 'trkvue_geofence_map' }
	]
});