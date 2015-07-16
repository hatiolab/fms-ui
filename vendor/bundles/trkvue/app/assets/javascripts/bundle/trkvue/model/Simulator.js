Ext.define('Trkvue.model.Simulator', {

	extend : 'Ext.data.Model',

	fields : [
		{ name : 'id', type : 'string' },
		{ name : 'name', type : 'string' },
		{ name : 'description', type : 'string' },
		{ name : 'type', type : 'string' },
		{ name : 'fleet_group_id', type : 'string' },
		{ name : 'fleet_group', type : 'auto' },
		{ name : 'fleet_id', type : 'string' },
		{ name : 'fleet', type : 'auto' },
		{ name : 'fleet_ver', type : 'string' },
		{ name : 'url', type : 'string' },
		{ name : 'lat', type : 'float' },
		{ name : 'lng', type : 'float' },
		{ name : 'total_count', type : 'integer' },
		{ name : 'simulator_path_id', type : 'string' },
		{ name : 'simulator_path', type : 'auto' },
		{ name : 'velocity', type : 'integer' },
		{ name : 'kick_counter', type : 'integer' },
		{ name : 'gx', type : 'float' },
		{ name : 'gy', type : 'float' },
		{ name : 'gz', type : 'float' },
		{ name : 'event_type', type : 'string' },
		{ name : 'severity', type : 'string' },
		{ name : 'stillcut_cycle', type : 'integer' },
		{ name : 'event_cycle', type : 'integer' },
		{ name : 'stillcut_paths', type : 'string' },
		{ name : 'invoke_cycle', type : 'float' },
		{ name : 'movie_paths', type : 'string' },
		{ name : 'creator_id', type : 'string' },
		{ name : 'creator', type : 'auto' },
		{ name : 'updater_id', type : 'string' },
		{ name : 'updater', type : 'auto' },
		{ name : 'created_at', type : 'date' },
		{ name : 'updated_at', type : 'date' },
		{ name : '_cud_flag_', type : 'string' }
	],

	validations : [
		{ type : 'presence', field : 'name' },
		{ type : 'presence', field : 'type' },
		{ type : 'presence', field : 'url' },
		{ type : 'length', field : 'name', max : 32 },
		{ type : 'length', field : 'description', max : 255 },
		{ type : 'length', field : 'type', max : 20 },
		{ type : 'length', field : 'fleet_group_id', max : 32 },
		{ type : 'length', field : 'fleet_id', max : 32 },
		{ type : 'length', field : 'fleet_ver', max : 20 },
		{ type : 'length', field : 'url', max : 255 },
		{ type : 'length', field : 'simulator_path_id', max : 32 },
		{ type : 'length', field : 'event_type', max : 10 },
		{ type : 'length', field : 'severity', max : 10 },
		{ type : 'length', field : 'stillcut_paths', max : 500 },
		{ type : 'length', field : 'movie_paths', max : 1000 }
	],
	
	proxy : {
		type : 'rest',
		url : 'simulators',
		format : 'json',
		reader : {
			type : 'json'
		},
		writer : {
			type : 'json',
			root : 'simulator'
		}
	}
});