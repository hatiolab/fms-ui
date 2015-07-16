/**
 * TrackDetail controller
 */
Ext.define('Trkvue.controller.track.TrackItem', {
	
	extend : 'Frx.controller.ItemController',
	
	requires : [ 
		'Trkvue.model.Track', 
		'Trkvue.store.Track', 
		'Trkvue.view.track.TrackItem'
	],
	
	mixins : [
		'Frx.mixin.lifecycle.FormLifeCycle'
	],
	
	models : ['Trkvue.model.Track'],
			
	stores : ['Trkvue.store.Track'],
	
	views : ['Trkvue.view.track.TrackItem'],
	
	init : function() {
		this.callParent(arguments);
		
		this.control({
			'trkvue_track_item' : this.EntryPoint(),
			'trkvue_track_form' : this.FormEventHandler()
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