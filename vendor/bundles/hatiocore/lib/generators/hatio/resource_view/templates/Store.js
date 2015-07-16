Ext.define('<%= @bundle %>.store.<%= class_name %>', {
	
	extend : 'Ext.data.Store',
	
	requires : '<%= @bundle %>.model.<%= class_name %>',
	
	model : '<%= @bundle %>.model.<%= class_name %>',
	
	autoLoad : false,

	remoteFilter : true,
	
	remoteSort : true,
	
	pageSize : 30,
	
<%= Hatio::Generators::ResourceViewUtil.grid_sort_option(@columns, "\t") %>
	
	proxy : {
		type : 'rest',
		url : '<%= table_name %>',
		format : 'json',
	    reader : {
			type : 'json',
			root : 'items',
			successProperty : 'success',
			totalProperty : 'total'
        },
        writer : {
			type : 'json'
        }
	}
	
});