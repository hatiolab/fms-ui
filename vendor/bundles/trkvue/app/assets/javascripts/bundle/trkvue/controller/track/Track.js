/**
 * Track controller
 */
Ext.define('Trkvue.controller.track.Track', {
	
	extend : 'Frx.controller.ListController',
	
	requires : [ 
		'Trkvue.model.Track', 
		'Trkvue.store.Track', 
		'Trkvue.view.track.Track' 
	],
	
	models : ['Trkvue.model.Track'],
			
	stores : ['Trkvue.store.Track'],
	
	views : ['Trkvue.view.track.Track'],
		
	init : function() {
		this.callParent(arguments);
		
		this.control({
			'trkvue_track' : this.EntryPoint(),
			'trkvue_track #goto_item' : {
				click : this.onGotoItem
			},
			'trkvue_track #fimgshow' : {
				click : this.onFrontImgSlideShow
			},
			'trkvue_track #rimgshow' : {
				click : this.onRearImgSlideShow
			}
		});
	},
	
	onFrontImgSlideShow : function(grid, item, rowIndex, colIndex, e, record) {
		this.onSlideShow('f_img', record);
	},
	
	onRearImgSlideShow : function(grid, item, rowIndex, colIndex, e, record) {
		this.onSlideShow('r_img', record);
	},
	
	onSlideShow : function(dataIndex, record) {
		var imgPath = record.get(dataIndex);
		if(!imgPath || imgPath == '' || imgPath.length < 10) {
			return;
		}
		
		var imgNames = imgPath.split('/');
		var imgName = imgNames[imgNames.length - 1];
		var imgPath = CONTENT_BASE_URL + imgPath;
		var showDataList = [{
			name : imgName,
			path : imgPath,
			url : imgPath,
			mimetype : 'image',
			
		}];
		
		HF.slideshow(showDataList);
	}

});