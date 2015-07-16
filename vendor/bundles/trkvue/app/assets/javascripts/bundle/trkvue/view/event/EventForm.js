Ext.define('Trkvue.view.event.EventForm', {
	
	extend : 'Ext.form.Panel',
	
	xtype : 'trkvue_event_form',
	
	title : T('title.basic_info'),
		
	autoScroll : true,
	
	defaults : { xtype : 'textfield', anchor : '100%' },
	
	items : [
		{ name : 'id', fieldLabel : T('label.id') },
		{ name : 'dom', fieldLabel : T('label.cid'), hidden : true },
		{ name : 'fid', fieldLabel : T('label.fid'), allowBlank : false, maxLength : 32 },
		{ name : 'fvr', fieldLabel : T('label.fvr'), allowBlank : false, maxLength : 32 },
		{ name : 'did', fieldLabel : T('label.did'), allowBlank : false, maxLength : 32 },
		{ name : 'tid', fieldLabel : T('label.tid'), allowBlank : false, maxLength : 32 },
		{ name : 'bid', fieldLabel : T('label.bid'), allowBlank : false, maxLength : 32 },
		{ name : 'gid', fieldLabel : T('label.gid'), allowBlank : true, maxLength : 32 },
		{ name : 'kct', fieldLabel : T('label.kct'), xtype : 'numberfield' },
		{ name : 'typ', fieldLabel : T('label.type'), xtype : 'codecombo', commonCode : 'EVENT_TYPE' },
		{ name : 'vlc', fieldLabel : T('label.vlc'), xtype : 'numberfield' },
		{ name : 'svr', fieldLabel : T('label.svr') },
		{ name : 'lat', fieldLabel : T('label.lat'), xtype : 'numberfield' },
		{ name : 'lng', fieldLabel : T('label.lng'), xtype : 'numberfield' },
		{ name : 'gx', fieldLabel : T('label.gx'), xtype : 'numberfield' },
		{ name : 'gy', fieldLabel : T('label.gy'), xtype : 'numberfield' },
		{ name : 'gz', fieldLabel : T('label.gz'), xtype : 'numberfield' },
		{ name : 'vdo', fieldLabel : T('label.vdo'), maxLength : 255 },
		{ name : 'f_vdo', fieldLabel : T('label.f_vdo'), maxLength : 255 },
		{ name : 'r_vdo', fieldLabel : T('label.r_vdo'), maxLength : 255 },
		{ name : 'ado', fieldLabel : T('label.ado'), maxLength : 255 },
		{ name : 'etm', fieldLabel : T('label.otm'), allowBlank : false },
		{ name : 'ctm', fieldLabel : T('label.created_at'), allowBlank : false }
	],
	
	dockedItems: [ {
		xtype: 'controlbar',
		items: ['->', 'list', 'save', 'delete']
	} ]
});