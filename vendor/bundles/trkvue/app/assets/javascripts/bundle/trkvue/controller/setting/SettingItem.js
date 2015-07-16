/**
 * SettingDetail controller
 */
Ext.define('Trkvue.controller.setting.SettingItem', {
	
	extend : 'Frx.controller.ItemController',
	
	requires : [ 
		'Trkvue.model.Setting', 
		'Trkvue.store.Setting', 
		'Trkvue.view.setting.SettingItem'
	],
	
	mixins : [
		'Frx.mixin.lifecycle.FormLifeCycle'
	],
	
	models : ['Trkvue.model.Setting'],
			
	stores : ['Trkvue.store.Setting'],
	
	views : ['Trkvue.view.setting.SettingItem'],
	
	init : function() {
		this.callParent(arguments);
		
		this.control({
			'trkvue_setting_item' : this.EntryPoint(),
			'trkvue_setting_form' : this.FormEventHandler()
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