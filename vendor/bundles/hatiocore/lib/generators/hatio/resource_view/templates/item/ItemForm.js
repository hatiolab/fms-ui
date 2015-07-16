Ext.define('<%= @bundle %>.view.<%= singular_name %>.<%= class_name %>Form', {
	
	extend : 'Ext.form.Panel',
	
	xtype : '<%= @bundle.downcase %>_<%= singular_name %>_form',
	
	title : T('title.basic_info'),
		
	autoScroll : true,
	
	defaults : { xtype : 'textfield', anchor : '100%' },
	
	<%= Hatio::Generators::ResourceViewUtil.generate_form(@domain, "#{singular_name}", @columns, options, "\t\t") %>,
	
	dockedItems: [ {
		xtype: 'controlbar',
		items: ['->', 'list', 'save', 'delete']
	} ]
});