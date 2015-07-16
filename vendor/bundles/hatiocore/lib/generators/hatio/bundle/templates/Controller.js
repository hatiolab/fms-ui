Ext.define('<%= class_name %>.controller.<%= class_name %>Controller', {
	extend: 'Ext.app.Controller',

	requires: [],

	stores: [],
	
	models: [],

	views: [],

	controllers: [],

	init: function() {
		var self = this;

		Ext.each(this.controllers, function(ctl) {
			self.getController('<%= class_name %>.controller.' + ctl);
		});

		this.control({
		});
	}
});
