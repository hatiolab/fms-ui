/**
 * TripDetail controller
 */
Ext.define('Trkvue.controller.trip.TripItem', {
	
	extend : 'Frx.controller.ItemController',
	
	requires : [ 
		'Trkvue.model.Trip', 
		'Trkvue.store.Trip', 
		'Trkvue.view.trip.TripItem'
	],
	
	mixins : [
		'Frx.mixin.lifecycle.FormLifeCycle'
	],
	
	models : ['Trkvue.model.Trip'],
			
	stores : ['Trkvue.store.Trip'],
	
	views : ['Trkvue.view.trip.TripItem'],
	
	init : function() {
		this.callParent(arguments);
		
		this.control({
			'trkvue_trip_item' : this.EntryPoint(),
			'trkvue_trip_form' : this.FormEventHandler()
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