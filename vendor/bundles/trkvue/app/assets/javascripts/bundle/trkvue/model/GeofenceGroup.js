Ext.define('Trkvue.model.GeofenceGroup', {

	extend : 'Ext.data.Model',

	fields : [
		{ name : 'id', type : 'string' },
		{ name : 'geofence_id', type : 'string' },
		{ name : 'geofence', type : 'auto' },
		{ name : 'fleet_group_id', type : 'string' },
		{ name : 'fleet_group', type : 'auto' },
		{ name : 'alarm_type', type : 'string' },
		{ name : 'creator_id', type : 'string' },
		{ name : 'creator', type : 'auto' },
		{ name : 'updater_id', type : 'string' },
		{ name : 'updater', type : 'auto' },
		{ name : 'created_at', type : 'date' },
		{ name : 'updated_at', type : 'date' },
		{ name : '_cud_flag_', type : 'string' }
	],

	/*validations : [
		{ type : 'presence', field : 'geofence_id' },
		{ type : 'presence', field : 'fleet_group_id' }
	],*/
	
	proxy : {
		type : 'rest',
		url : 'geofence_groups',
		format : 'json',
		reader : {
			type : 'json'
		},
		writer : {
			type : 'json',
			root : 'geofence_group'
		}
	}
});