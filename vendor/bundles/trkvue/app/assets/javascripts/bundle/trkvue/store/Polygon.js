Ext.define('Trkvue.store.Polygon', {
	
	extend : 'Ext.data.Store',
	
	requires : 'Trkvue.model.Polygon',
	
	model : 'Trkvue.model.Polygon',
	
	autoLoad : false,

	remoteFilter : true,
	
	remoteSort : true,
	
	pageSize : 10000,
	
	sorters : [ { 
		property : 'geofence_id', direction : 'asc' 
	} ],
	
	proxy : {
		type : 'rest',
		url : 'polygons',
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