Ext.define('Trkvue.view.driver.Driver', {
	
	extend : 'Frx.common.ListView',
	
	xtype : 'trkvue_driver',
	
	title : T('menu.Driver'),
	
	store : 'Trkvue.store.Driver',
	
	columns : [
		{ header : T('label.id'), dataIndex : 'id', hidden : true },
		{ header : T('label.code'), dataIndex : 'code'  },
		{ header : T('label.name'), dataIndex : 'name' , editor : { xtype : 'textfield' , maxLength : 64 } },
		{ header : T('label.social_id'), dataIndex : 'social_id' , editor : { xtype : 'textfield' , maxLength : 32 } },
		{ header : T('label.email'), dataIndex : 'email', width : 180 , editor : { xtype : 'textfield' , maxLength : 64 } },
		{ header : T('label.title'), dataIndex : 'title' , editor : { xtype : 'textfield' , maxLength : 32 } },
		{ header : T('label.division'), dataIndex : 'division' , editor : { xtype : 'textfield' , maxLength : 32 } },
		{ header : T('label.phone'), dataIndex : 'phone_no' , editor : { xtype : 'textfield' , maxLength : 32 } },
		{ header : T('label.mobile'), dataIndex : 'mobile_no' , editor : { xtype : 'textfield' , maxLength : 32 } },
		{ header : T('label.address'), dataIndex : 'address', width : 250 , editor : { xtype : 'textfield' , maxLength : 255 } },
		{ header : T('label.updater'), dataIndex : 'updater', xtype : 'entitycolumn' },
		{ header : T('label.updated_at'), dataIndex : 'updated_at', xtype : 'datecolumn', format : T('format.datetime'), width : 135 },
	],	
	
	dockedItems : [ {
		xtype : 'searchform',
		items : [
			{ name : 'code-like', fieldLabel : T('label.code')},
			{ name : 'name-like', fieldLabel : T('label.name')},
			{ name : 'social_id-like', fieldLabel : T('label.social_id')},
			{ name : 'title-like', fieldLabel : T('label.title')},
			{ name : 'division-like', fieldLabel : T('label.division')},
		]
	}, {
		xtype : 'controlbar',
		items : ['->', 'import', 'export', 'add', 'save', 'delete']
	} ]
});