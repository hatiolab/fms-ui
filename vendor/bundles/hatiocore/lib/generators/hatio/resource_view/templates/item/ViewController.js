/**
 * <%= class_name %>Detail controller
 */
Ext.define('<%= @bundle %>.controller.<%= singular_name %>.<%= class_name %>Item', {
	
	extend : 'Frx.controller.ItemController',
	
	requires : [ 
		'<%= @bundle %>.model.<%= class_name %>', 
		'<%= @bundle %>.store.<%= class_name %>', 
		'<%= @bundle %>.view.<%= singular_name %>.<%= class_name %>Item'
	],
	
	mixins : [
		'Frx.mixin.lifecycle.FormLifeCycle'
	],
	
	models : ['<%= @bundle %>.model.<%= class_name %>'],
			
	stores : ['<%= @bundle %>.store.<%= class_name %>'],
	
	views : ['<%= @bundle %>.view.<%= singular_name %>.<%= class_name %>Item'],
	
	init : function() {
		this.callParent(arguments);
		
		this.control({
			'<%= @bundle.downcase %>_<%= singular_name %>_item' : this.EntryPoint(),
			'<%= @bundle.downcase %>_<%= singular_name %>_form' : this.FormEventHandler()
		});
	},
	
	/****************************************************************
	 ** 					여기는 customizing area 				   **
	 ****************************************************************/
	// Customized code here ...
	
	/****************************************************************
	 ** 					Override 구현 						   **
	 ****************************************************************/

	
	/****************************************************************
	 ** 					abstract method, 필수 구현 				   **
	****************************************************************/

});