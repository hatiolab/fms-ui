/**
 * Fleet controller
 */
Ext.define('Trkvue.controller.fleet.Fleet', {
	
	extend : 'Frx.controller.ListController',
	
	requires : [ 
		'Trkvue.model.Fleet', 
		'Trkvue.store.Fleet', 
		'Trkvue.view.fleet.Fleet' 
	],
	
	models : ['Trkvue.model.Fleet'],
			
	stores : ['Trkvue.store.Fleet'],
	
	views : ['Trkvue.view.fleet.Fleet'],
		
	init : function() {
		this.callParent(arguments);
		
		this.control({
			'trkvue_fleet' : this.EntryPoint(),
			'trkvue_fleet #goto_item' : {
				click : this.onGotoItem
			}
		});
	}

});