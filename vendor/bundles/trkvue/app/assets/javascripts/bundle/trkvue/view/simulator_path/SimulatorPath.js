Ext.define('Trkvue.view.simulator_path.SimulatorPath', {
	
	extend : 'Frx.common.ListView',
	
	xtype : 'trkvue_simulator_path',
	
	title : T('menu.SimulatorPath'),
	
	store : 'Trkvue.store.SimulatorPath',
	
	columns : [
		{ header : T('label.id'), dataIndex : 'id', hidden : true },
		{ header : T('label.name'), dataIndex : 'name', width : 150, editor : { xtype : 'textfield' , maxLength : 32 } },
		{ header : T('label.description'), dataIndex : 'description', flex : 1, editor : { xtype : 'textfield' , maxLength : 255 } },
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