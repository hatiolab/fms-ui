/**
 * Trip controller
 */
Ext.define('Trkvue.controller.trip.Trip', {
	
	extend : 'Frx.controller.ListController',
	
	requires : [ 
		'Trkvue.model.Trip', 
		'Trkvue.store.Trip', 
		'Trkvue.view.trip.Trip' 
	],
	
	models : ['Trkvue.model.Trip'],
			
	stores : ['Trkvue.store.Trip'],
	
	views : ['Trkvue.view.trip.Trip'],
		
	init : function() {
		this.callParent(arguments);
		
		this.control({
			'trkvue_trip' : this.EntryPoint(),
			'trkvue_trip #goto_item' : {
				click : this.onGotoItem
			}
		});
	}

});