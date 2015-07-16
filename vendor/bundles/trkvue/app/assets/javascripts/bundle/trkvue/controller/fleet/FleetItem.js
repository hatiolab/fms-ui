/**
 * FleetDetail controller
 */
Ext.define('Trkvue.controller.fleet.FleetItem', {
	
	extend : 'Frx.controller.ItemController',
	
	requires : [ 
		'Trkvue.model.Fleet', 
		'Trkvue.store.Fleet', 
		'Trkvue.view.fleet.FleetItem'
	],
	
	mixins : [
		'Frx.mixin.lifecycle.FormLifeCycle'
	],
	
	models : ['Trkvue.model.Fleet'],
			
	stores : ['Trkvue.store.Fleet'],
	
	views : ['Trkvue.view.fleet.FleetItem'],
	
	init : function() {
		this.callParent(arguments);
		
		this.control({
			'trkvue_fleet_item' : this.EntryPoint(),
			'trkvue_fleet_form' : this.FormEventHandler()
		});
	},
	
	/****************************************************************
	 ** 					여기는 customizing area 				   **
	 ****************************************************************/
	// Customized code here ...
	
	/****************************************************************
	 ** 					Override 구현 						   **
	 ****************************************************************/

	
	/****************************************************************
	 ** 					abstract method, 필수 구현 				   **
	****************************************************************/

});