Ext.define('Trkvue.view.fleet_group.FleetGroup', {
	
	extend : 'Frx.common.ListView',
	
	xtype : 'trkvue_fleet_group',
	
	title : T('menu.FleetGroup'),
	
	store : 'Trkvue.store.FleetGroup',
	
	columns : [
		{ header : T('label.id'), dataIndex : 'id', hidden : true },
		{ header : T('label.name'), dataIndex : 'name' , editor : { xtype : 'textfield' , maxLength : 32 } },
		{ header : T('label.description'), dataIndex : 'description', flex : 1 , editor : { xtype : 'textfield' , maxLength : 255 } },
		{ header : T('label.creator'), dataIndex : 'creator', xtype : 'entitycolumn' },
		{ header : T('label.updater'), dataIndex : 'updater', xtype : 'entitycolumn' },
		{ header : T('label.created_at'), dataIndex : 'created_at', xtype : 'datecolumn', format : T('format.datetime'), width : 135 },
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