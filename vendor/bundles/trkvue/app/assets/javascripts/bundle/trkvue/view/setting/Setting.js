Ext.define('Trkvue.view.setting.Setting', {
	
	extend : 'Frx.common.ListView',
	
	xtype : 'trkvue_setting',
	
	title : T('menu.Setting'),
	
	store : 'Trkvue.store.Setting',
	
	columns : [
		{ header : T('label.id'), dataIndex : 'id', hidden : true },
		{ header : T('label.global'), dataIndex : 'global_flag' , xtype : 'checkcolumn'  },
		{ header : T('label.name'), dataIndex : 'name', editor : { xtype : 'textfield' , maxLength : 32 } },
		{ header : T('label.description'), dataIndex : 'description', flex : 1 , editor : { xtype : 'textfield' , maxLength : 255 } },
		{ header : T('label.value'), dataIndex : 'value' , editor : { xtype : 'textfield' } },
		{ header : T('label.updater'), dataIndex : 'updater', xtype : 'entitycolumn' },
		{ header : T('label.updated_at'), dataIndex : 'updated_at', xtype : 'datecolumn', format : T('format.datetime'), width : 135 },
	],	
	
	dockedItems : [ {
		xtype : 'searchform',
		items : [
			{ name : 'name-like', fieldLabel : T('label.name')},
			{ name : 'description-like', fieldLabel : T('label.description')},
		]
	}, {
		xtype : 'controlbar',
		items : ['->', 'import', 'export', 'add', 'save', 'delete']
	} ]
});