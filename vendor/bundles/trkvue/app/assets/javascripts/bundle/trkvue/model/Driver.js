Ext.define('Trkvue.model.Driver', {
    
	extend : 'Ext.data.Model',
    
	fields : [
		{ name : 'id', type : 'integer' },
		{ name : 'code', type : 'string' },
		{ name : 'name', type : 'string' },
		{ name : 'social_id', type : 'string' },
		{ name : 'email', type : 'string' },
		{ name : 'title', type : 'string' },
		{ name : 'division', type : 'string' },
		{ name : 'phone_no', type : 'string' },
		{ name : 'mobile_no', type : 'string' },
		{ name : 'address', type : 'string' },
		{ name : 'img', type : 'string' },
		{ name : 'creator_id', type : 'integer' },
		{ name : 'creator', type : 'auto' },
		{ name : 'updater_id', type : 'integer' },
		{ name : 'updater', type : 'auto' },
		{ name : 'created_at', type : 'date' },
		{ name : 'updated_at', type : 'date' },
		{ name : '_cud_flag_', type : 'string' }
	],

	validations : [
		{ type : 'presence', field : 'code' },
		{ type : 'length', field : 'code', max : 32 },
		{ type : 'presence', field : 'name' },
		{ type : 'length', field : 'name', max : 64 },
		{ type : 'length', field : 'social_id', max : 32 },
		{ type : 'length', field : 'email', max : 64 },
		{ type : 'length', field : 'title', max : 32 },
		{ type : 'length', field : 'division', max : 32 },
		{ type : 'length', field : 'phone_no', max : 32 },
		{ type : 'length', field : 'mobile_no', max : 32 },
		{ type : 'length', field : 'address', max : 255 },
		{ type : 'length', field : 'img', max : 255 },
	],
	
	proxy : {
		type : 'rest',
		url : 'drivers',
		format : 'json',
		reader : {
			type : 'json'
		},
		writer : {
			type : 'json',
			root : 'driver'
		}
	}
});