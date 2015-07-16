Ext.define('Trkvue.store.GeofenceGroup', {
	
	extend : 'Ext.data.Store',
	
	requires : 'Trkvue.model.GeofenceGroup',
	
	model : 'Trkvue.model.GeofenceGroup',
	
	autoLoad : false,

	remoteFilter : true,
	
	remoteSort : true,
	
	pageSize : 30,
	
	proxy : {
		type : 'rest',
		url : 'geofence_groups',
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