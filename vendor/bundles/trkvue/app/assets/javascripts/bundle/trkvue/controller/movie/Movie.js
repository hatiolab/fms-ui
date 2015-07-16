/**
 * Movie controller
 */
Ext.define('Trkvue.controller.movie.Movie', {
	
	extend : 'Frx.controller.ListController',
	
	requires : [ 
		'Trkvue.model.Movie', 
		'Trkvue.store.Movie', 
		'Trkvue.view.movie.Movie',
		'Base.view.attachment.AttachmentMoviePopup'
	],
	
	models : ['Trkvue.model.Movie'],
			
	stores : ['Trkvue.store.Movie'],
	
	views : ['Trkvue.view.movie.Movie'],
		
	init : function() {
		this.callParent(arguments);
		
		this.control({
			'trkvue_movie' : this.EntryPoint(),
			'trkvue_movie #goto_item' : {
				click : this.onGotoItem
			},
			'trkvue_movie #vdo' : {
				click : this.onPlayMovie
			},
			'base_attachment_movie_popup' : {
				paramschange : this.onMoviePopupParamsChange
			},
			'base_attachment_movie_popup button' : {
				click : this.onPopupClose
			}
		});
	},
	
	onPlayMovie : function(grid, item, rowIndex, colIndex, e, record) {
		var movPath = record.get('file_path');
		if(!movPath || movPath == '' || movPath.length < 10) {
			return;
		}
		
		var movPath = CONTENT_BASE_URL + movPath;
		var showData = {
			path : movPath,
			mimetype : 'video/mp4'
		};
		
		HF.popup('Base.view.attachment.AttachmentMoviePopup', showData, {});
	},

	onMoviePopupParamsChange : function(popup, params) {
		popup.setRecord(params);
	},
	
	onPopupClose : function(button, event) {
		button.up(' base_attachment_movie_popup').close();
	}
});