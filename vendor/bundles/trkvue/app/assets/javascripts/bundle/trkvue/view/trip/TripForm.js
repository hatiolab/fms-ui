Ext.define('Trkvue.view.trip.TripForm', {
	
	extend : 'Ext.form.Panel',
	
	xtype : 'trkvue_trip_form',
	
	title : T('title.basic_info'),
		
	autoScroll : true,
	
	defaults : { xtype : 'textfield', anchor : '100%' },
	
	items : [
		{ name : 'id', fieldLabel : T('label.id') },
		{ name : 'dom', fieldLabel : T('label.cid'), hidden : true },
		{ name : 'bid', fieldLabel : T('label.bid'), allowBlank : false, maxLength : 32 },
		{ name : 'fid', fieldLabel : T('label.fid'), allowBlank : false, maxLength : 32 },
		{ name : 'fvr', fieldLabel : T('label.fvr'), allowBlank : false, maxLength : 32 },
		{ name : 'did', fieldLabel : T('label.did'), allowBlank : false, maxLength : 32 },
		{ name : 's_lat', fieldLabel : T('label.s_lat'), xtype : 'numberfield' },
		{ name : 's_lng', fieldLabel : T('label.s_lng'), xtype : 'numberfield' },
		{ name : 'lat', fieldLabel : T('label.lat'), xtype : 'numberfield' },
		{ name : 'lng', fieldLabel : T('label.lng'), xtype : 'numberfield' },
		{ name : 'sts', fieldLabel : T('label.sts'), allowBlank : false },
		{ name : 'vlc', fieldLabel : T('label.vlc'), xtype : 'numberfield' },
		//{ name : 'a_vlc', fieldLabel : T('label.vlc'), xtype : 'numberfield' },
		{ name : 'c_off', fieldLabel : T('label.c_off'), xtype : 'numberfield' },
		{ name : 'c_idl', fieldLabel : T('label.c_idl'), xtype : 'numberfield' },
		{ name : 'c_low', fieldLabel : T('label.c_low'), xtype : 'numberfield' },
		{ name : 'c_nml', fieldLabel : T('label.c_nml'), xtype : 'numberfield' },
		{ name : 'c_hgh', fieldLabel : T('label.c_hgh'), xtype : 'numberfield' },
		{ name : 'c_ovr', fieldLabel : T('label.c_ovr'), xtype : 'numberfield' },
		{ name : 'stm', fieldLabel : T('label.stm'), xtype : 'numberfield' },
		{ name : 'etm', fieldLabel : T('label.etm'), xtype : 'numberfield' },
		{ name : 'utm', fieldLabel : T('label.utm'), xtype : 'numberfield' }
	],
	
	dockedItems: [ {
		xtype: 'controlbar',
		items: ['->', 'list', 'save', 'delete']
	} ]
});