Ext.define('Trkvue.store.Movie', {
	
	extend : 'Ext.data.Store',
	
	requires : 'Trkvue.model.Movie',
	
	model : 'Trkvue.model.Movie',
	
	autoLoad : false,

	remoteFilter : true,
	
	remoteSort : true,
	
	pageSize : 30,
	
	sorters : [ { 
		property : 'created_at', direction : 'desc' 
	} ],
	
	proxy : {
		type : 'rest',
		url : 'movies',
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