/**
 * BatchDetail controller
 */
Ext.define('Trkvue.controller.batch.BatchItem', {
	
	extend : 'Frx.controller.ItemController',
	
	requires : [ 
		'Trkvue.model.Batch', 
		'Trkvue.store.Batch', 
		'Trkvue.view.batch.BatchItem'
	],
	
	mixins : [
		'Frx.mixin.lifecycle.FormLifeCycle'
	],
	
	models : ['Trkvue.model.Batch'],
			
	stores : ['Trkvue.store.Batch'],
	
	views : ['Trkvue.view.batch.BatchItem'],
	
	init : function() {
		this.callParent(arguments);
		
		this.control({
			'trkvue_batch_item' : this.EntryPoint(),
			'trkvue_batch_form' : this.FormEventHandler()
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