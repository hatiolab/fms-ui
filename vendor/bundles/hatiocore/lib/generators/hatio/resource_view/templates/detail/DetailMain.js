Ext.define('<%= @bundle %>.view.<%= singular_name %>.<%= class_name %>Detail', {
	
	extend : 'Base.abstract.entity.DetailMainView',
	
 	requires : [ 
		'<%= @bundle %>.view.<%= singular_name %>.<%= class_name %>Form'
	],
	
	xtype : '<%= @bundle.downcase %>_<%= singular_name %>_detail',
	
	title : T('title.<%= singular_name %>'),
	
	items : [ {
		xtype : '<%= @bundle.downcase %>_<%= singular_name %>_form'
	} ],
	
	setRecord : function(record) {
		this.record = record;
		HF.setTitle(T('title.<%= singular_name %>') + ' ' + this.record.get('name'));
		this.down('form').loadRecord(this.record);
	},
	
	getRecord : function() {
		return this.record;
	}
});