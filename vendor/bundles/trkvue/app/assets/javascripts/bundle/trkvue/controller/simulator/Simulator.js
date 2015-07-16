/**
 * Simulator controller
 */
Ext.define('Trkvue.controller.simulator.Simulator', {
	
	extend : 'Frx.controller.ListController',
	
	requires : [ 
		'Trkvue.model.Simulator', 
		'Trkvue.store.Simulator', 
		'Trkvue.view.simulator.Simulator' 
	],
	
	models : ['Trkvue.model.Simulator'],
			
	stores : ['Trkvue.store.Simulator'],
	
	views : ['Trkvue.view.simulator.Simulator'],
		
	init : function() {
		this.callParent(arguments);
		
		this.control({
			'trkvue_simulator' : this.EntryPoint(),
			'trkvue_simulator #goto_item' : {
				click : this.onGotoItem
			}
		});
	}

});