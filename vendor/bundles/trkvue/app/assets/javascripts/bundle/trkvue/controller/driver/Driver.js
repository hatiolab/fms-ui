/**
 * Driver controller
 */
Ext.define('Trkvue.controller.driver.Driver', {
	
	extend : 'Frx.controller.ListController',
	
	mixins : { slideshow : 'Base.mixin.lifecycle.ListSlideShow' },
	
	requires : [ 
		'Trkvue.model.Driver', 
		'Trkvue.store.Driver', 
		'Trkvue.view.driver.Driver' 
	],
	
	models : ['Trkvue.model.Driver'],
			
	stores : ['Trkvue.store.Driver'],
	
	views : ['Trkvue.view.driver.Driver'],
		
	init : function() {
		this.callParent(arguments);
		
		this.control({
			'trkvue_driver' : this.EntryPoint(),
			'trkvue_driver #goto_item' : {
				click : this.onGotoItem
			},
			'trkvue_driver #slideshow' : {
				click : this.onSlideShow
			}
		});
	}

});