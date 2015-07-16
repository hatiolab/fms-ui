Ext.define('Trkvue.view.simulator.SimulatorItem', {
	
	extend : 'Ext.tab.Panel',
	
	requires : [ 'Trkvue.view.simulator.SimulatorForm'],
	
	mixins : { spotlink : 'Frx.mixin.view.SpotLink' },
	
	xtype : 'trkvue_simulator_item',
	
	title : T('menu.Simulator'),
	
	items : [ 
		{ xtype : 'trkvue_simulator_form' }
	]
});