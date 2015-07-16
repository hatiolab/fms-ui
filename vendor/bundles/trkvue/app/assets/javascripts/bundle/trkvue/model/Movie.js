Ext.define('Trkvue.model.Movie', {
    
	extend : 'Ext.data.Model',
    
	fields : [
		{ name : 'id', type : 'string' },
		{ name : 'event_id', type : 'string' },
		{ name : 'total_size', type : 'integer' },
		{ name : 'start_byte', type : 'integer' },
		{ name : 'chunk_size', type : 'integer' },
		{ name : 'chunk_count', type : 'integer' },
		{ name : 'chunk_index', type : 'integer' },
		{ name : 'file_path', type : 'string' },
		{ name : 'created_at', type : 'date' },
		{ name : '_cud_flag_', type : 'string' }
	],

	validations : [
		{ type : 'presence', field : 'event_id' },
		{ type : 'length', field : 'event_id', max : 32 },
		{ type : 'presence', field : 'total_size' },
		{ type : 'presence', field : 'start_byte' },
		{ type : 'presence', field : 'chunk_size' },
		{ type : 'presence', field : 'chunk_count' },
		{ type : 'presence', field : 'chunk_index' },
		{ type : 'presence', field : 'file_path' },
		{ type : 'length', field : 'file_path', max : 255 },
	],
	
  	proxy : {
		type : 'rest',
		url : 'movies',
		format : 'json',
	    reader : {
			type : 'json'
        },
        writer : {
			type : 'json',
			root : 'movie'
        }
	}
});