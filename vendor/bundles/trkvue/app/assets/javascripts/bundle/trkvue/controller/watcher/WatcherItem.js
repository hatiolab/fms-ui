/**
 * Watcher Item controller
 */
Ext.define('Trkvue.controller.watcher.WatcherItem', {
	
	extend : 'Frx.controller.ItemController',
	
	requires : [ 
		'Trkvue.view.watcher.WatcherItem'
	],
	
	mixins : [
		'Frx.mixin.lifecycle.FormLifeCycle',
		'Trkvue.mixin.TripMonitor'
	],
	
	models : [],
			
	stores : [],
	
	views : ['Trkvue.view.watcher.WatcherItem'],
	
	init : function() {
		this.callParent(arguments);
		
		this.control({
			'trkvue_watcher_item' : this.EntryPoint({
				click_back : this.onClickBack
			})
		});
	},
	
	loadItem : function(view, params) {
		var fleet = params.fleet;
		
	},
	
	onClickBack : function(button) {
		HF.history.back();
	}
	
});