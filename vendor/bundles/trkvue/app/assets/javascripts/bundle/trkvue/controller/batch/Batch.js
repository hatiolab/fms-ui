/**
 * Batch controller
 */
Ext.define('Trkvue.controller.batch.Batch', {
	
	extend : 'Frx.controller.ListController',
	
	requires : [ 
		'Trkvue.model.Batch', 
		'Trkvue.store.Batch', 
		'Trkvue.view.batch.Batch' 
	],
	
	models : ['Trkvue.model.Batch'],
			
	stores : ['Trkvue.store.Batch'],
	
	views : ['Trkvue.view.batch.Batch'],
		
	init : function() {
		this.callParent(arguments);
		
		this.control({
			'trkvue_batch' : this.EntryPoint(),
			'trkvue_batch #goto_item' : {
				click : this.onGotoItem
			}
		});
	}

});