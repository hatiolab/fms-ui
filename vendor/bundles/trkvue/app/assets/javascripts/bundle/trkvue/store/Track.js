Ext.define('Trkvue.store.Track', {
	
	extend : 'Ext.data.Store',
	
	requires : 'Trkvue.model.Track',
	
	model : 'Trkvue.model.Track',
	
	autoLoad : false,

	remoteFilter : true,
	
	remoteSort : true,
	
	pageSize : 30,
	
	sorters : [ { 
		property : 'ctm', direction : 'desc' 
	} ],
	
	proxy : {
		type : 'rest',
		url : 'tracks',
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