Ext.define('Trkvue.view.movie.Movie', {
	
	extend : 'Frx.common.ListView',
	
	xtype : 'trkvue_movie',
	
	title : T('menu.Movie'),
	
	store : 'Trkvue.store.Movie',
	
	columns : [
		{ header : T('label.id'), dataIndex : 'id', hidden : true },
		{ header : T('label.event_id'), dataIndex : 'event_id', width : 180, editor : { xtype : 'textfield' } },
		{ header : T('label.total_size'), dataIndex : 'total_size', xtype : 'numbercolumn', format : T('format.number'), align : 'right', editor : { xtype : 'numberfield' } },
		{ header : T('label.start_byte'), dataIndex : 'start_byte', xtype : 'numbercolumn', format : T('format.number'), align : 'right', editor : { xtype : 'numberfield' } },
		{ header : T('label.chunk_size'), dataIndex : 'chunk_size', xtype : 'numbercolumn', format : T('format.number'), align : 'right', editor : { xtype : 'numberfield' } },
		{ header : T('label.chunk_count'), dataIndex : 'chunk_count', xtype : 'numbercolumn', format : T('format.number'), align : 'right', editor : { xtype : 'numberfield' } },
		{ header : T('label.chunk_index'), dataIndex : 'chunk_index', xtype : 'numbercolumn', format : T('format.number'), align : 'right', editor : { xtype : 'numberfield' } },
		{ xtype: 'actioncolumn', icon: 'assets/std/iconSlideshow.png', itemId : 'vdo', width : 30, align : 'center' },
		{ header : T('label.file_path'), dataIndex : 'file_path' , width : 440, editor : { xtype : 'textfield' , maxLength : 255 } },
		{ header : T('label.created_at'), dataIndex : 'created_at', width : 135, xtype : 'datecolumn', format : T('format.datetime') },
	],	
	
	dockedItems : [ {
		xtype : 'searchform',
		items : [
			{ name : 'event_id-like', fieldLabel : T('label.event_id')},
		]
	}, {
		xtype : 'controlbar',
		items : ['->', 'import', 'export', 'add', 'save', 'delete']
	} ]
});