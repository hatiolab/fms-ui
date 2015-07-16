Ext.define('<%= @bundle %>.view.<%= singular_name %>.<%= class_name %>List', {
	
	extend : 'Base.abstract.entity.ReportGridView',
	
	xtype : '<%= @bundle.downcase %>_<%= singular_name %>_list',
		
	store : Ext.create('Ext.data.Store', {
		
		<%= Hatio::Generators::ReportViewUtil.generateStore(@domain, @out_params) %>,
		
		autoLoad : false,
		
		remoteFilter : true,
		
		// TODO url : shoot.json, method : post
		proxy : {
			type : 'ajax',
			url : <%= @service_url %>,
			format : 'json',
			reader : {
				type : 'json'
			}
		}
	}),
	
	<%= Hatio::Generators::ReportViewUtil.generateColumns(@domain, @out_params) %>
});