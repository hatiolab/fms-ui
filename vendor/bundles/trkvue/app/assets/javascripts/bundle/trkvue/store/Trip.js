Ext.define('Trkvue.store.Trip', {
	
	extend : 'Ext.data.Store',
	
	requires : 'Trkvue.model.Trip',
	
	model : 'Trkvue.model.Trip',
	
	autoLoad : false,

	remoteFilter : true,
	
	remoteSort : true,
	
	pageSize : 30,
	
	sorters : [ { 
		property : 'stm', direction : 'desc' 
	} ],
	
	proxy : {
		type : 'rest',
		url : 'trips',
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