Ext.define('Trkvue.store.Geofence', {
	
	extend : 'Ext.data.Store',
	
	requires : 'Trkvue.model.Geofence',
	
	model : 'Trkvue.model.Geofence',
	
	autoLoad : false,

	remoteFilter : true,
	
	remoteSort : true,
	
	pageSize : 30,
	
	sorters : [ { 
		property : 'name', direction : 'asc' 
	} ],
	
	proxy : {
		type : 'rest',
		url : 'geofences',
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