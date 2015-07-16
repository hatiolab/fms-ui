Ext.define('Trkvue.store.Fleet', {
	
	extend : 'Ext.data.Store',
	
	requires : 'Trkvue.model.Fleet',
	
	model : 'Trkvue.model.Fleet',
	
	autoLoad : false,

	remoteFilter : true,
	
	remoteSort : true,
	
	pageSize : 30,
	
	sorters : [ { 
		property : 'name', direction : 'asc' 
	} ],
	
	proxy : {
		type : 'rest',
		url : 'fleets',
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