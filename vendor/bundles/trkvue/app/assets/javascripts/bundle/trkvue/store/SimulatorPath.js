Ext.define('Trkvue.store.SimulatorPath', {
	
	extend : 'Ext.data.Store',
	
	requires : 'Trkvue.model.SimulatorPath',
	
	model : 'Trkvue.model.SimulatorPath',
	
	autoLoad : false,

	remoteFilter : true,
	
	remoteSort : true,
	
	pageSize : 30,
	
	sorters : [
		{ property : 'name', direction : 'asc' },
	],
	
	proxy : {
		type : 'rest',
		url : 'simulator_paths',
		format : 'json',
	    reader : {
			type : 'json',
			root : 'items',
			successProperty : 'success',
			totalProperty : 'total'
        },
        writer : {
			type : 'json'
        }
	}
	
});