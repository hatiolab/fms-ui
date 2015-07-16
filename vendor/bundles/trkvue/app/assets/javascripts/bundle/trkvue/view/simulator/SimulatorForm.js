Ext.define('Trkvue.view.simulator.SimulatorForm', {
	
	extend : 'Ext.form.Panel',
	
	xtype : 'trkvue_simulator_form',
	
	title : T('title.basic_info'),
		
	autoScroll : true,
	
	defaults : { xtype : 'textfield', anchor : '100%' },
	
	items : [
		{ name : 'id', fieldLabel : T('label.id'), hidden : true },
		{ name : 'name', fieldLabel : T('label.name'), allowBlank : false, maxLength : 32 },
		{ name : 'description', fieldLabel : T('label.description'), maxLength : 255 },
		{ name : 'type', fieldLabel : T('label.type'), xtype : 'codecombo', commonCode : 'SIMULATION_TYPE' },
		{ name : 'fleet_group', fieldLabel : T('label.fleet_group'), xtype : 'entityfield', storeClass : 'Trkvue.store.FleetGroup', hidden : true },
		{ name : 'fleet', fieldLabel : T('label.fleet'), xtype : 'entityfield', storeClass : 'Trkvue.store.Fleet' },
		{ name : 'fleet_ver', fieldLabel : T('label.fleet_ver'), maxLength : 20 },
		{ name : 'url', fieldLabel : T('label.url'), allowBlank : false, maxLength : 255 },
		{ name : 'lat', fieldLabel : T('label.lat'), xtype : 'numberfield' },
		{ name : 'lng', fieldLabel : T('label.lng'), xtype : 'numberfield' },
		{ name : 'total_count', fieldLabel : T('label.total_count'), xtype : 'numberfield' },
		{ name : 'simulator_path', fieldLabel : T('label.simulator_path'), xtype : 'entityfield', storeClass : 'Trkvue.store.SimulatorPath' },
		{ name : 'velocity', fieldLabel : T('label.velocity'), xtype : 'numberfield', maxValue : 200 },
		{ name : 'kick_counter', fieldLabel : T('label.kick_counter'), xtype : 'numberfield', minValue : 0 },
		{ name : 'gx', fieldLabel : T('label.gx'), xtype : 'numberfield', minValue : -1, maxValue : 1 },
		{ name : 'gy', fieldLabel : T('label.gy'), xtype : 'numberfield', minValue : -1, maxValue : 1 },
		{ name : 'gz', fieldLabel : T('label.gz'), xtype : 'numberfield', minValue : -1, maxValue : 1 },
		{ name : 'event_type', fieldLabel : T('label.event_type'), maxLength : 10 },
		{ name : 'severity', fieldLabel : T('label.severity'), maxLength : 10 },
		{ name : 'invoke_cycle', fieldLabel : T('label.invoke_cycle'), xtype : 'numberfield', maxValue : 100000 },
		{ name : 'stillcut_cycle', fieldLabel : T('label.stillcut_cycle'), xtype : 'numberfield', maxValue : 100000, hidden : true },
		{ name : 'event_cycle', fieldLabel : T('label.event_cycle'), xtype : 'numberfield', maxValue : 100000, hidden : true },
		{ name : 'stillcut_paths', fieldLabel : T('label.stillcut_paths'), maxLength : 500, hidden : true },
		{ name : 'movie_paths', fieldLabel : T('label.movie_paths'), maxLength : 1000, hidden : true },
		{ xtype : 'timestamp' }
	],
	
	dockedItems: [ {
		xtype: 'controlbar',
		items: ['invoke', '->', 'list', 'save', 'delete']
	} ]
});