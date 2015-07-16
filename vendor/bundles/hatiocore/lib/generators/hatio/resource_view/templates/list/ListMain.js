Ext.define('<%= @bundle %>.view.<%= singular_name %>.<%= class_name %>', {
	
	extend : 'Frx.common.ListView',
	
	xtype : '<%= @bundle.downcase %>_<%= singular_name %>',
	
	title : T('menu.<%= class_name %>'),
	
	store : '<%= @bundle %>.store.<%= class_name %>',
	
	<%= Hatio::Generators::ResourceViewUtil.generate_grid(@domain, singular_name, @columns, options, nil) %>	
	
	dockedItems : [ {
		xtype : 'searchform',
		<%= Hatio::Generators::ResourceViewUtil.generate_search_items(@domain, class_name, @columns, nil, nil) %>
	}, {
		xtype : 'controlbar',
		items : ['->', 'import', 'export', 'add', 'save', 'delete']
	} ]
});