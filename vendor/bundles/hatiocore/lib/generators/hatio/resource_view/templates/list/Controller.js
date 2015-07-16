/**
 * <%= class_name %> controller
 */
Ext.define('<%= @bundle %>.controller.<%= singular_name %>.<%= class_name %>', {
	
	extend : 'Frx.controller.ListController',
	<% if(options.use_attachment == 'y') %>
	mixins : { slideshow : 'Base.mixin.lifecycle.ListSlideShow' },
	<% end %>
	requires : [ 
		'<%= @bundle %>.model.<%= class_name %>', 
		'<%= @bundle %>.store.<%= class_name %>', 
		'<%= @bundle %>.view.<%= singular_name %>.<%= class_name %>' 
	],
	
	models : ['<%= @bundle %>.model.<%= class_name %>'],
			
	stores : ['<%= @bundle %>.store.<%= class_name %>'],
	
	views : ['<%= @bundle %>.view.<%= singular_name %>.<%= class_name %>'],
		
	init : function() {
		this.callParent(arguments);
		
		this.control({
			'<%= @bundle.downcase %>_<%= singular_name %>' : this.EntryPoint(),
			'<%= @bundle.downcase %>_<%= singular_name %> #goto_item' : {
				click : this.onGotoItem
			}<% if(options.use_attachment == 'y') %>,
			'<%= @bundle.downcase %>_<%= singular_name %> #slideshow' : {
				click : this.onSlideShow
			}<% end %>
		});
	}

});