Ext.define('Trkvue.store.Batch', {
	
	extend : 'Ext.data.Store',
	
	requires : 'Trkvue.model.Batch',
	
	model : 'Trkvue.model.Batch',
	
	autoLoad : false,

	remoteFilter : true,
	
	remoteSort : true,
	
	pageSize : 30,
	
	sorters : [ { 
		property : 'stm', direction : 'desc' 
	} ],
	
	proxy : {
		type : 'rest',
		url : 'batches',
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