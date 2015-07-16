Ext.define('Trkvue.view.batch.BatchForm', {
	
	extend : 'Ext.form.Panel',
	
	xtype : 'trkvue_batch_form',
	
	title : T('title.basic_info'),
		
	autoScroll : true,
	
	defaults : { xtype : 'textfield', anchor : '100%' },
	
	items : [
		{ name : 'id', fieldLabel : T('label.id') },
		{ name : 'tid', fieldLabel : T('label.tid'), allowBlank : false },
		{ name : 'vlc', fieldLabel : T('label.vlc'), allowBlank : false },
		{ name : 'a_vlc', fieldLabel : T('label.a_vlc'), allowBlank : false },
		{ name : 'dst', fieldLabel : T('label.dst'), allowBlank : false },
		{ name : 's_lat', fieldLabel : T('label.s_lat'), allowBlank : false },
		{ name : 's_lng', fieldLabel : T('label.s_lng'), allowBlank : false },
		{ name : 'lat', fieldLabel : T('label.lat'), allowBlank : false },
		{ name : 'lng', fieldLabel : T('label.lng'), allowBlank : false },
		{ name : 'c_off', fieldLabel : T('label.c_off'), allowBlank : false },
		{ name : 'c_idl', fieldLabel : T('label.c_idl'), allowBlank : false },
		{ name : 'c_low', fieldLabel : T('label.c_low'), allowBlank : false },
		{ name : 'c_nml', fieldLabel : T('label.c_nml'), allowBlank : false },
		{ name : 'c_hgh', fieldLabel : T('label.c_hgh'), allowBlank : false },
		{ name : 'c_ovr', fieldLabel : T('label.c_ovr'), allowBlank : false },
		{ name : 'stm', fieldLabel : T('label.stm'), allowBlank : false },
		{ name : 'etm', fieldLabel : T('label.etm'), allowBlank : false },
		{ name : 'utm', fieldLabel : T('label.utm'), allowBlank : false }
	],
	
	dockedItems: [ {
		xtype: 'controlbar',
		items: ['->', 'list', 'save', 'delete']
	} ]
});