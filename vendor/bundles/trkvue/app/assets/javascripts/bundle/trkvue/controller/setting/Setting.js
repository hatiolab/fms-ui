/**
 * Setting controller
 */
Ext.define('Trkvue.controller.setting.Setting', {
	
	extend : 'Frx.controller.ListController',
	
	requires : [ 
		'Trkvue.model.Setting', 
		'Trkvue.store.Setting', 
		'Trkvue.view.setting.Setting' 
	],
	
	models : ['Trkvue.model.Setting'],
			
	stores : ['Trkvue.store.Setting'],
	
	views : ['Trkvue.view.setting.Setting'],
		
	init : function() {
		this.callParent(arguments);
		
		this.control({
			'trkvue_setting' : this.EntryPoint(),
			'trkvue_setting #goto_item' : {
				click : this.onGotoItem
			}
		});
	}

});