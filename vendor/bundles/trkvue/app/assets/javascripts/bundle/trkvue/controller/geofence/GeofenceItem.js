/**
 * GeofenceDetail controller
 */
Ext.define('Trkvue.controller.geofence.GeofenceItem', {
	
	extend : 'Frx.controller.ItemController',
	
	requires : [ 
		'Trkvue.model.Geofence', 
		'Trkvue.store.Geofence',
		'Trkvue.model.Polygon', 
		'Trkvue.store.Polygon',
		'Trkvue.view.geofence.GeofenceItem',
		'Trkvue.view.geofence.GeofenceFleetGroupList',
		'Trkvue.view.geofence.GeofenceMap'
	],
	
	mixins : [
		'Frx.mixin.lifecycle.FormLifeCycle',
		'Frx.mixin.lifecycle.ListLifeCycle'
	],
	
	models : ['Trkvue.model.Geofence'],
			
	stores : ['Trkvue.store.Geofence'],
	
	views : ['Trkvue.view.geofence.GeofenceItem'],
	
	init : function() {
		this.callParent(arguments);
		
		this.control({
			'trkvue_geofence_item' : this.EntryPoint(),
			'trkvue_geofence_form' : this.FormEventHandler(),
			'trkvue_geofence_fleet_group_list' : this.ListEventHandler({
				after_load_item : this.onFleetGroupListLoad
			}),
			'trkvue_geofence_map #gmap' : {
				mapready : this.onMapReady
			},
			'trkvue_geofence_map #edit_chk': {
				change: this.onChangeEdit
			},
			'trkvue_geofence_map #save': {
				click: this.onPolygonSave
			}
		});
	},
	
	/**
	 * multiple update url을 리턴 
	 */
	getUpdateListUrl : function(grid) {
		return 'geofence_groups/update_multiple.json';
	},
	
	onAfterUpdateList : function(grid, updateType, response) {
		grid.store.reload();
		var successMsg = (updateType == 'd') ? T('text.Success to Delete') : T('text.Success to Update');
		HF.msg.notice(successMsg);
	},
	
	/**
	 * override
	 */
	newRecord : function(grid) {
		var model = Ext.create('Trkvue.model.GeofenceGroup');
		model.set('geofence_id', HF.current.view().getParams().id);
		return model;
	},
	
	loadItem : function(view, params) {
		this.callParent(arguments);
		this.mainView = view;
		
		if(this.getMapView() && this.getMapItem() && this.getMap()) {
			this.initPolygon(this.getMap(), params.id);
		}
	},
	
	onFleetGroupListLoad : function(view, record, operation) {
		view.store.proxy.extraParams = {
			'_q[geofence_id-eq]' : record.get('id')
		};
		view.store.load();
	},
	
	getMapView : function() {
		//return HF.current.view().down('trkvue_geofence_map');
		return this.mainView.down('trkvue_geofence_map');
	},
	
	getMapItem : function() {
		return this.getMapView().down(' #gmap');
	},
	
	getMap : function() {
		return this.getMapItem().gmap;
	},
	
	isMapEditable : function() {
		return this.getMapView().down('#edit_chk').checked;
	},
	
	getGeofenceId : function() {
		//return HF.current.view().getParams().id;
		return this.mainView.getParams().id;
	},

	onMapReady : function(map) {
		var mapView = this.getMapView();
		var gmap = map.gmap;
		var geofenceId = this.getGeofenceId();
		this.initPolygon(gmap, geofenceId);
	},
	
	initPolygon : function(gmap, geofenceId) {
		if(geofenceId) {
			var store = Ext.getStore('Trkvue.store.Polygon');
			if(!store) {
				store = Ext.create('Trkvue.store.Polygon');
			}
			
			store.getProxy().extraParams = { '_q[geofence_id-eq]' : geofenceId };
			store.load({
				scope: this,
				callback: function(records, operation, success) {
					if(success) {
						this.setDrawingManager(null);
						this.setDrawingManager(this.createDrawingManager(gmap));
						this.setPolygon(null);

						if(records && records.length > 0) {
							this.setPolygon(this.createPolygon(gmap, records));
						}
					}
				}
			});
		}
	},
	
	setPolygon : function(polygon) {
		if (this.polygon)
			this.polygon.setMap(null);

		this.polygon = polygon;
		 
		if(this.polygon && !this.isMapEditable()) {
			this.polygon.setOptions({
				draggable: false,
				editable: false
			});
		}
	},
	
	createPolygon : function(gmap, records) {
		var coordinates = [];

		for(var i = 0; i < records.length; i++) {
			var record = records[i];
			var point = new google.maps.LatLng(record.get('lat'), record.get('lng'));
			coordinates.push(point);
		}
	
		var polygon = new google.maps.Polygon({
			paths: coordinates,
			strokeColor: "#FF0000",
			strokeOpacity: 0.8,
			strokeWeight: 2,
			fillColor: "#FF0000",
			fillOpacity: 0.35,
			editable: true,
			draggable: true
		});

		polygon.setMap(gmap);
		var bounds = new google.maps.LatLngBounds();
	
		coordinates.forEach(function(point) {
			bounds.extend(point)	
		});

		gmap.fitBounds(bounds);
		var paths = polygon.getPaths();
		var self = this;
		
		paths.forEach(function(path) {
			google.maps.event.addListener(path, 'set_at', function() {
				self.setLatLng(path);
			});
			google.maps.event.addListener(path, 'insert_at', function() {
				self.setLatLng(path);
			});
			google.maps.event.addListener(path, 'remove_at', function() {
				self.setLatLng(path);
			});
		});

		return polygon;
	},
	
	setDrawingManager : function(drawingManager) {
		if (this.drawingManager)
			this.drawingManager.setMap(null);

		this.drawingManager = drawingManager;
	},

	createDrawingManager : function(gmap) {
		var self = this;
		/* Drawing */
		var drawingManager = new google.maps.drawing.DrawingManager({
			// drawingMode: google.maps.drawing.OverlayType.POLYGON,
			drawingControl: true,
			drawingControlOptions: {
				position: google.maps.ControlPosition.TOP_CENTER,
				drawingModes: [
					google.maps.drawing.OverlayType.POLYGON
				]
			},
			markerOptions: {
				draggable: true
			},
			polygonOptions: {
				draggable: true,
				editable: true,
				strokeColor: "#FF0000",
				fillColor: "#FF0000"
			},
			circleOptions: {
				fillColor: '#ffff00',
				fillOpacity: 1,
				strokeWeight: 5,
				clickable: false,
				editable: true,
				zIndex: 1
			}
		});
		
		drawingManager.setMap(gmap);
		google.maps.event.addListener(drawingManager, 'overlaycomplete', function(event) {
			if (event.type == google.maps.drawing.OverlayType.CIRCLE) {
				var radius = event.overlay.getRadius();
				
			} else if (event.type == google.maps.drawing.OverlayType.POLYGON) {
				var polygon = event.overlay;
				var paths = polygon.getPaths();

				paths.forEach(function(path) {
					google.maps.event.addListener(path, 'set_at', function() {
						self.setLatLng(path);
					})
					google.maps.event.addListener(path, 'insert_at', function() {
						self.setLatLng(path);
					})
					google.maps.event.addListener(path, 'remove_at', function() {
						self.setLatLng(path);
					})
				});
			
				self.setPolygon(polygon);
				self.setPoint(paths.getArray()[0]);
			}
		});
	
		return drawingManager;
	},
	
	setPoint: function(path) {
		this.pathArr = [];
		var self = this;
		path.getArray().forEach(function(latLng) {
			self.pathArr.push(latLng);
		});
	},
	
	onChangeEdit: function(check, newValue, oldValue, eOpts) {
		var geofenceId = this.getGeofenceId();
		var gmap = this.getMap();
	
		if(geofenceId) {
			var mapView = this.getMapView();
			var editChecked = this.isMapEditable();
			
			if(this.polygon && editChecked) {
				this.setDrawingManager(this.createDrawingManager(gmap));
				this.polygon.setOptions({
					draggable: true,
					editable: true
				});
				
			} else if(this.polygon && !editChecked){
				this.setDrawingManager(null);
				this.polygon.setOptions({
					draggable: false,
					editable: false
				});
				
			} else if (!this.polygon && editChecked) {
				this.setDrawingManager(this.createDrawingManager(gmap));
				
			} else if (!this.polygon && !editChecked) {
				this.setDrawingManager(null);
			}
		}
	},
	
	onPolygonSave : function() {
		var geofenceId = this.getGeofenceId();
		var self = this;
		var pathItems = [];
		
		for(var i = 0; i < this.pathArr.length; i++) {
			pathItems.push({
				"geofence_id" : geofenceId,
				"lat" : this.pathArr[i].lat(),
				"lng" : this.pathArr[i].lng()
			});
		}
		
		var pathItemsStr = Ext.JSON.encode(pathItems);
		Ext.Ajax.request({
			url : "geofences/" + geofenceId + "/update_multiple_polygons.json",
			method : 'POST',
			params : { multiple_data : pathItemsStr },
			scope : this,
			success : function(response) {
				HF.msg.alert("Success");
			}
		});
	}
});