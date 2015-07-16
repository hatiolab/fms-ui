Ext.define('Trkvue.model.Setting', {
    
	extend : 'Ext.data.Model',
    
	fields : [
		{ name : 'id', type : 'string' },
		{ name : 'global_flag', type : 'boolean' },
		{ name : 'name', type : 'string' },
		{ name : 'description', type : 'string' },
		{ name : 'value', type : 'text' },
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
		{ type : 'length', field : 'name', max : 64 },
		{ type : 'length', field : 'description', max : 255 },
		{ type : 'presence', field : 'value' },
	],
	
	proxy : {
		type : 'rest',
		url : 'settings',
		format : 'json',
		reader : {
			type : 'json'
		},
		writer : {
			type : 'json',
			root : 'setting'
		}
	}
});