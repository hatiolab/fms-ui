/**
 * Event controller
 */
Ext.define('Trkvue.controller.event.Event', {
	
	extend : 'Frx.controller.ListController',
	
	requires : [ 
		'Trkvue.model.Event', 
		'Trkvue.store.Event', 
		'Trkvue.view.event.Event',
		'Base.view.attachment.AttachmentAudioPopup',
		'Base.view.attachment.AttachmentMoviePopup'
	],
	
	models : ['Trkvue.model.Event'],
			
	stores : ['Trkvue.store.Event'],
	
	views : ['Trkvue.view.event.Event'],
		
	init : function() {
		this.callParent(arguments);
		
		this.control({
			'trkvue_event' : this.EntryPoint(),
			'trkvue_event #goto_item' : {
				click : this.onGotoItem
			},
			'trkvue_event #vdo' : {
				click : this.onPlayTotalMovie
			},
			'trkvue_event #f_vdo' : {
				click : this.onPlayFrontMovie
			},
			'trkvue_event #r_vdo' : {
				click : this.onPlayRearMovie
			},
			'trkvue_event #ado' : {
				click : this.onPlaySound
			},
			'base_attachment_movie_popup' : {
				paramschange : this.onMoviePopupParamsChange
			},
			'base_attachment_movie_popup button' : {
				click : this.onMoviePopupClose
			},
			'base_attachment_audio_popup' : {
				paramschange : this.onAudioPopupParamsChange
			},
			'base_attachment_audio_popup button' : {
				click : this.onAudioPopupClose
			}
		});
	},
	
	onPlaySound : function(grid, item, rowIndex, colIndex, e, record) {
		var audPath = record.get('ado');
		if(!audPath || audPath == '' || audPath.length < 10) {
			return;
		}
		
		var audPath = CONTENT_BASE_URL + audPath;
		var showData = {
			path : audPath,
			mimetype : 'audio/mp3'
		};
		
		HF.popup('Base.view.attachment.AttachmentAudioPopup', showData, {});
	},
	
	onPlayTotalMovie : function(grid, item, rowIndex, colIndex, e, record) {
		this.onPlayMovie('vdo', record);
	},
	
	onPlayFrontMovie : function(grid, item, rowIndex, colIndex, e, record) {
		this.onPlayMovie('f_vdo', record);
	},
	
	onPlayRearMovie : function(grid, item, rowIndex, colIndex, e, record) {
		this.onPlayMovie('r_vdo', record);
	},
	
	onPlayMovie : function(dataIndex, record) {
		var movPath = record.get(dataIndex);
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
	
	onAudioPopupParamsChange : function(popup, params) {
		popup.setRecord(params);
	},
	
	onMoviePopupClose : function(button, event) {
		var popup = button.up(' base_attachment_movie_popup');
		popup.close();
	},
	
	onAudioPopupClose : function(button, event) {
		var popup = button.up(' base_attachment_audio_popup');
		popup.close();
	}

});