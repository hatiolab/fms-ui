Ext.define('Trkvue.view.setting.SettingItem', {
	
	extend : 'Ext.tab.Panel',
	
	requires : [ 'Trkvue.view.setting.SettingForm'],
	
	mixins : { spotlink : 'Frx.mixin.view.SpotLink' },
	
	xtype : 'trkvue_setting_item',
	
	title : T('menu.Setting'),
	
	items : [ 
		{ xtype : 'trkvue_setting_form' }
	]
});