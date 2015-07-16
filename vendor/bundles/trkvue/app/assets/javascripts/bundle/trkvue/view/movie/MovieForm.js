Ext.define('Trkvue.view.movie.MovieForm', {
	
	extend : 'Ext.form.Panel',
	
	xtype : 'trkvue_movie_form',
	
	title : T('title.basic_info'),
		
	autoScroll : true,
	
	defaults : { xtype : 'textfield', anchor : '100%' },
	
	items : [
		{ name : 'id', fieldLabel : T('label.id'), hidden : true },
		{ name : 'event_id', fieldLabel : T('label.event_id'), allowBlank : false, maxLength : 32 },
		{ name : 'total_size', fieldLabel : T('label.total_size'), xtype : 'numberfield' },
		{ name : 'start_byte', fieldLabel : T('label.start_byte'), xtype : 'numberfield' },
		{ name : 'chunk_size', fieldLabel : T('label.chunk_size'), xtype : 'numberfield' },
		{ name : 'chunk_count', fieldLabel : T('label.chunk_count'), xtype : 'numberfield' },
		{ name : 'chunk_index', fieldLabel : T('label.chunk_index'), xtype : 'numberfield' },
		{ name : 'file_path', fieldLabel : T('label.file_path'), allowBlank : false, maxLength : 255 },
		{ xtype : 'timestamp' }
	],
	
	dockedItems: [ {
		xtype: 'controlbar',
		items: ['->', 'list', 'save', 'delete']
	} ]
});