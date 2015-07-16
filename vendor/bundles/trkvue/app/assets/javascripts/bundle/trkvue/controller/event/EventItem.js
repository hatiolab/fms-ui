/**
 * EventDetail controller
 */
Ext.define('Trkvue.controller.event.EventItem', {
	
	extend : 'Frx.controller.ItemController',
	
	requires : [ 
		'Trkvue.model.Event', 
		'Trkvue.store.Event', 
		'Trkvue.view.event.EventItem'
	],
	
	mixins : [
		'Frx.mixin.lifecycle.FormLifeCycle'
	],
	
	models : ['Trkvue.model.Event'],
			
	stores : ['Trkvue.store.Event'],
	
	views : ['Trkvue.view.event.EventItem'],
	
	init : function() {
		this.callParent(arguments);
		
		this.control({
			'trkvue_event_item' : this.EntryPoint(),
			'trkvue_event_form' : this.FormEventHandler()
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