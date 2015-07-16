Ext.define('Trkvue.view.simulator_path.SimulatorPathItem', {
	
	extend : 'Ext.tab.Panel',
	
	requires : [ 'Trkvue.view.simulator_path.SimulatorPathForm'],
	
	mixins : { spotlink : 'Frx.mixin.view.SpotLink' },
	
	xtype : 'trkvue_simulator_path_item',
	
	title : T('menu.SimulatorPath'),
	
	items : [ 
		{ xtype : 'trkvue_simulator_path_form' }
	]
});