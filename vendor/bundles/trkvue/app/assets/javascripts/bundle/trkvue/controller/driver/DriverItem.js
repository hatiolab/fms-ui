/**
 * DriverDetail controller
 */
Ext.define('Trkvue.controller.driver.DriverItem', {
	
	extend : 'Frx.controller.ItemController',
	
	requires : [ 
		'Trkvue.model.Driver', 
		'Trkvue.store.Driver', 
		'Trkvue.view.driver.DriverItem'
	],
	
	mixins : [
		'Frx.mixin.lifecycle.FormLifeCycle'
	],
	
	models : ['Trkvue.model.Driver'],
			
	stores : ['Trkvue.store.Driver'],
	
	views : ['Trkvue.view.driver.DriverItem'],
	
	init : function() {
		this.callParent(arguments);
		
		this.control({
			'trkvue_driver_item' : this.EntryPoint(),
			'trkvue_driver_form' : this.FormEventHandler()
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