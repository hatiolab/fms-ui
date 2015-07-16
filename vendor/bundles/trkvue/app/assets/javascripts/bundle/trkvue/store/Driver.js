Ext.define('Trkvue.store.Driver', {
	
	extend : 'Ext.data.Store',
	
	requires : 'Trkvue.model.Driver',
	
	model : 'Trkvue.model.Driver',
	
	autoLoad : false,

	remoteFilter : true,
	
	remoteSort : true,
	
	pageSize : 30,
	
	sorters : [ { 
		property : 'id', direction : 'asc' 
	} ],
	
	proxy : {
		type : 'rest',
		url : 'drivers',
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