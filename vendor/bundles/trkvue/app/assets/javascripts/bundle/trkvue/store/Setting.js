Ext.define('Trkvue.store.Setting', {
	
	extend : 'Ext.data.Store',
	
	requires : 'Trkvue.model.Setting',
	
	model : 'Trkvue.model.Setting',
	
	autoLoad : false,

	remoteFilter : true,
	
	remoteSort : true,
	
	pageSize : 30,
	
	sorters : [ { 
		property : 'name', direction : 'asc' 
	} ],
	
	proxy : {
		type : 'rest',
		url : 'settings',
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