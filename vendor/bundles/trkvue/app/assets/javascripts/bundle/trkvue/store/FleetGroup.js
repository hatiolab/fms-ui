Ext.define('Trkvue.store.FleetGroup', {
	
	extend : 'Ext.data.Store',
	
	requires : 'Trkvue.model.FleetGroup',
	
	model : 'Trkvue.model.FleetGroup',
	
	autoLoad : false,

	remoteFilter : true,
	
	remoteSort : true,
	
	pageSize : 30,
	
	sorters : [ { 
		property : 'name', direction : 'asc' 
	} ],
	
	proxy : {
		type : 'rest',
		url : 'fleet_groups',
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