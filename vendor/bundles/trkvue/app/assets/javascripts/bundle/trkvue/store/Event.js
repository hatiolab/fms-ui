Ext.define('Trkvue.store.Event', {
	
	extend : 'Ext.data.Store',
	
	requires : 'Trkvue.model.Event',
	
	model : 'Trkvue.model.Event',
	
	autoLoad : false,

	remoteFilter : true,
	
	remoteSort : true,
	
	pageSize : 30,
	
	sorters : [ { 
		property : 'ctm', direction : 'desc' 
	} ],
	
	proxy : {
		type : 'rest',
		url : 'events',
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