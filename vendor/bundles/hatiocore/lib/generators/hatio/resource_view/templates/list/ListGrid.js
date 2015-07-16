Ext.define('<%= @bundle %>.view.<%= singular_name %>.<%= class_name %>List', {
	
	extend : 'Base.abstract.entity.ListGridView',
	
	xtype : '<%= @bundle.downcase %>_<%= singular_name %>_list',
		
	store : '<%= @bundle %>.store.<%= class_name %>',
	
	<%= Hatio::Generators::ResourceViewUtil.generate_grid(@domain, singular_name, @columns, nil, nil) %>
});