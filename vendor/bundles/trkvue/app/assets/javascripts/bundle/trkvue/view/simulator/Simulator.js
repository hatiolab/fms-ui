Ext.define('Trkvue.view.simulator.Simulator', {
	
	extend : 'Frx.common.ListView',
	
	xtype : 'trkvue_simulator',
	
	title : T('menu.Simulator'),
	
	store : 'Trkvue.store.Simulator',
	
	columns : [
		{ header : T('label.id'), dataIndex : 'id', hidden : true },
		{ header : T('label.name'), dataIndex : 'name', width : 150 , editor : { xtype : 'textfield' , maxLength : 32 } },
		{ header : T('label.description'), dataIndex : 'description', width : 230 , editor : { xtype : 'textfield' , maxLength : 255 } },
		{ header : T('label.type'), dataIndex : 'type', editor : { xtype : 'codecombo', commonCode : 'SIMULATION_TYPE' } },
		//{ header : T('label.fleet_group'), dataIndex : 'fleet_group_id', xtype : 'entitycolumn', editor : { xtype : 'entitycolumneditor', storeClass : 'Trkvue.store.FleetGroup' } },
		{ header : T('label.fleet'), dataIndex : 'fleet', xtype : 'entitycolumn', editor : { xtype : 'entitycolumneditor', storeClass : 'Trkvue.store.Fleet' } },
		{ header : T('label.url'), dataIndex : 'url', width : 300 , editor : { xtype : 'textfield' , maxLength : 255 } },
		//{ header : T('label.simulator_path'), dataIndex : 'simulator_path', xtype : 'entitycolumn', editor : { xtype : 'entitycolumneditor', storeClass : 'Trkvue.store.SimulatorPath' } },
		//{ header : T('label.invoke_cycle'), dataIndex : 'invoke_cycle', align : 'right' , editor : { xtype : 'numberfield' , maxValue : 100000 } },
		{ header : T('label.updater'), dataIndex : 'updater', xtype : 'entitycolumn' },
		{ header : T('label.updated_at'), dataIndex : 'updated_at', xtype : 'datecolumn', format : T('format.datetime'), width : 135 }
	],	
	
	dockedItems : [ {
		xtype : 'searchform',
		items : [
			{ name : 'name-like', fieldLabel : T('label.name')},
			{ name : 'description-like', fieldLabel : T('label.description')},
			{ name : 'type-eq', fieldLabel : T('label.type'), xtype : 'codesearchcombo', commonCode : 'SIMULATION_TYPE', valueField : 'name', displayField : 'name' },
			{ name : 'fleet_group.name-eq', fieldLabel : T('label.fleet_group'), xtype : 'entitysearchcombo', storeClass : 'Trkvue.store.FleetGroup', valueField : 'name' },
			{ name : 'fleet.name-eq', fieldLabel : T('label.fleet'), xtype : 'entitysearchcombo', storeClass : 'Trkvue.store.Fleet', valueField : 'name' },
			{ name : 'simulator_path.name-eq', fieldLabel : T('label.simulator_path'), xtype : 'entitysearchcombo', storeClass : 'Trkvue.store.SimulatorPath', valueField : 'name' }
		]
	}, {
		xtype : 'controlbar',
		items : ['->', 'import', 'export', 'add', 'save', 'delete']
	} ]
});