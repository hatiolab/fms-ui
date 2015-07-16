/**
 * Geofence controller
 */
Ext.define('Trkvue.controller.geofence.Geofence', {
	
	extend : 'Frx.controller.ListController',
	
	requires : [ 
		'Trkvue.model.Geofence', 
		'Trkvue.store.Geofence', 
		'Trkvue.view.geofence.Geofence' 
	],
	
	models : ['Trkvue.model.Geofence'],
			
	stores : ['Trkvue.store.Geofence'],
	
	views : ['Trkvue.view.geofence.Geofence'],
		
	init : function() {
		this.callParent(arguments);
		
		this.control({
			'trkvue_geofence' : this.EntryPoint(),
			'trkvue_geofence #goto_item' : {
				click : this.onGotoItem
			}
		});
	}

});