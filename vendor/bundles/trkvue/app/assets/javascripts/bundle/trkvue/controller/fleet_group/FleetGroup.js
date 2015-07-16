/**
 * FleetGroup controller
 */
Ext.define('Trkvue.controller.fleet_group.FleetGroup', {
	
	extend : 'Frx.controller.ListController',
	
	requires : [ 
		'Trkvue.model.FleetGroup', 
		'Trkvue.store.FleetGroup', 
		'Trkvue.view.fleet_group.FleetGroup' 
	],
	
	models : ['Trkvue.model.FleetGroup'],
			
	stores : ['Trkvue.store.FleetGroup'],
	
	views : ['Trkvue.view.fleet_group.FleetGroup'],
		
	init : function() {
		this.callParent(arguments);
		
		this.control({
			'trkvue_fleet_group' : this.EntryPoint(),
			'trkvue_fleet_group #goto_item' : {
				click : this.onGotoItem
			}
		});
	}

});