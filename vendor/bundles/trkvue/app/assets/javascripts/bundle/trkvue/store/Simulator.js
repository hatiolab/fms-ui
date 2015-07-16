Ext.define('Trkvue.store.Simulator', {
	
	extend : 'Ext.data.Store',
	
	requires : 'Trkvue.model.Simulator',
	
	model : 'Trkvue.model.Simulator',
	
	autoLoad : false,

	remoteFilter : true,
	
	remoteSort : true,
	
	pageSize : 30,
	
	sorters : [
		{ property : 'name', direction : 'asc' },
	],
	
	proxy : {
		type : 'rest',
		url : 'simulators',
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