Ext.define('<%= @bundle %>.view.<%= singular_name %>.<%= class_name %>Search', {
	
	extend : 'Base.abstract.entity.ListSearchView',
	
	xtype : '<%= @bundle.downcase %>_<%= singular_name %>_search',
	
	<%= Hatio::Generators::ReportViewUtil.generate_search_items(@domain, @in_params) %>
	
});