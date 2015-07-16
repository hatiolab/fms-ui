Ext.define('Trkvue.view.setting.SettingForm', {
	
	extend : 'Ext.form.Panel',
	
	xtype : 'trkvue_setting_form',
	
	title : T('title.basic_info'),
		
	autoScroll : true,
	
	defaults : { xtype : 'textfield', anchor : '100%' },
	
	items : [
		{ name : 'id', fieldLabel : T('label.id'), hidden : true },
		{ name : 'global_flag', fieldLabel : T('label.global_flag'), xtype : 'checkboxfield', inputValue : true },
		{ name : 'name', fieldLabel : T('label.name'), allowBlank : false, maxLength : 64 },
		{ name : 'description', fieldLabel : T('label.description'), maxLength : 255 },
		{ name : 'value', fieldLabel : T('label.value'), xtype : 'textareafield', allowBlank : false },
		{ xtype : 'timestamp' }
	],
	
	dockedItems: [ {
		xtype: 'controlbar',
		items: ['->', 'list', 'save', 'delete']
	} ]
});