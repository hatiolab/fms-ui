Ext.define('Trkvue.view.geofence.Geofence', {
	
	extend : 'Frx.common.ListView',
	
	xtype : 'trkvue_geofence',
	
	title : T('menu.Geofence'),
	
	store : 'Trkvue.store.Geofence',
	
	columns : [
		{ header : T('label.id'), dataIndex : 'id', hidden : true },
		{ header : T('label.name'), dataIndex : 'name' , editor : { xtype : 'textfield' , maxLength : 64 } },
		{ header : T('label.description'), dataIndex : 'description', flex : 1 , editor : { xtype : 'textfield' , maxLength : 255 } },
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