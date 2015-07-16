/**
 * SimulatorPath controller
 */
Ext.define('Trkvue.controller.simulator_path.SimulatorPath', {
	
	extend : 'Frx.controller.ListController',
	
	requires : [ 
		'Trkvue.model.SimulatorPath', 
		'Trkvue.store.SimulatorPath', 
		'Trkvue.view.simulator_path.SimulatorPath' 
	],
	
	models : ['Trkvue.model.SimulatorPath'],
			
	stores : ['Trkvue.store.SimulatorPath'],
	
	views : ['Trkvue.view.simulator_path.SimulatorPath'],
		
	init : function() {
		this.callParent(arguments);
		
		this.control({
			'trkvue_simulator_path' : this.EntryPoint(),
			'trkvue_simulator_path #goto_item' : {
				click : this.onGotoItem
			}
		});
	}

});