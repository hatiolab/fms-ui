Ext.define('<%= @bundle %>.view.<%= singular_name %>.<%= class_name %>Item', {
	
	extend : 'Ext.tab.Panel',
	
	requires : [ '<%= @bundle %>.view.<%= singular_name %>.<%= class_name %>Form'],
	
	mixins : { spotlink : 'Frx.mixin.view.SpotLink' },
	
	xtype : '<%= @bundle.downcase %>_<%= singular_name %>_item',
	
	title : T('menu.<%= class_name %>'),
	
	items : [ 
		{ xtype : '<%= @bundle.downcase %>_<%= singular_name %>_form' }<% if(options.use_attachment == 'y') %>,
		{ xtype : 'base_attachment_form' }<% end %><% if(options.use_ext_prop == 'y') %>,
		{ xtype : 'base_property_form' }<% end %>
	]
});