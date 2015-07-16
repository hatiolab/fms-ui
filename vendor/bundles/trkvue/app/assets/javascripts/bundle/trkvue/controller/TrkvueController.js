Ext.define('Trkvue.controller.TrkvueController', {
	extend: 'Ext.app.Controller',

	requires: [],

	stores: [],
	
	models: [],

	views: [],

	controllers: [],

	init: function() {
		var self = this;

		Ext.each(this.controllers, function(ctl) {
			self.getController('Trkvue.controller.' + ctl);
		});

		this.control({
		});
	}
});
