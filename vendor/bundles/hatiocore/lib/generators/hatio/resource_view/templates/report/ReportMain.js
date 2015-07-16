Ext.define('<%= @bundle %>.view.<%= singular_name %>.<%= class_name %>', {
	
	extend: 'Base.abstract.entity.ListMainView',
	
 	requires : [ 
		'<%= @bundle %>.view.<%= singular_name %>.<%= class_name %>Search',
		'<%= @bundle %>.view.<%= singular_name %>.<%= class_name %>List'
	],
	
	xtype : '<%= @bundle.downcase %>_<%= singular_name %>',
	
	title : T('title.<%= singular_name %>'),
	
	searchView : '<%= @bundle.downcase %>_<%= singular_name %>_search',
	
	gridView : '<%= @bundle.downcase %>_<%= singular_name %>_list'

});