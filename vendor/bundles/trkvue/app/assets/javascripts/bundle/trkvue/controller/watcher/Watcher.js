/**
 * Watcher controller
 */
Ext.define('Trkvue.controller.watcher.Watcher', {
	
	extend : 'Frx.controller.ListController',
	
	mixins : [
		'Trkvue.mixin.OverviewMonitor',
		'Trkvue.mixin.TripMonitor'
	],
	
	requires : [ 
		'Trkvue.mixin.OverviewMonitor',
		'Trkvue.mixin.TripMonitor',
		'Trkvue.view.watcher.Watcher',
		'Trkvue.model.Fleet', 
		'Trkvue.model.Trip', 
		'Trkvue.model.Batch',
		'Trkvue.model.Track',
		'Trkvue.model.Event',
		'Trkvue.store.Fleet', 
		'Trkvue.store.Trip', 
		'Trkvue.store.Batch',
		'Trkvue.store.Track',
		'Trkvue.store.Event'
	],
	
	models : [ 
		'Trkvue.model.Fleet', 
		'Trkvue.model.Trip', 
		'Trkvue.model.Batch',
		'Trkvue.model.Track',
		'Trkvue.model.Event'
	],
	
	stores : [
		'Trkvue.store.Fleet', 
		'Trkvue.store.Trip', 
		'Trkvue.store.Batch',
		'Trkvue.store.Track',
		'Trkvue.store.Event'
	],
	
	views : [ 'Trkvue.view.watcher.Watcher' ],
	
	init : function() {
		this.callParent(arguments);
		
		this.control({
			'trkvue_watcher' : this.EntryPoint(),
			/*'trkvue_watcher #gmap' : {
				mapready : this.onMapReady
			},*/
			'trkvue_watcher #refresh' : {
				change : this.changeRefresh
			},
			'trkvue_watcher #interval' : {
				change : this.changeRefreshInterval
			}
		});
	},
	
	/**
	 * 자동 리프레쉬 주기 
	 */
	refreshInterval : 10 * 1000,
	/**
	 * 뷰 모드 
	 */
	viewMode : 'overview',
	
	/**
	 * Entry Point
	 */
	onParamsChange : function(view, params) {
		this.initFleetMap(true);
	},
	
	/*onMapReady : function(map) {
		this.initFleetMap(true);
	},*/
	
	changeRefreshInterval : function(numberfield, newValue, oldValue, eOpts) {
		this.refreshInterval = newValue * 1000;
	},
	
	/**
	 * Refresh 설정 변경 
	 */
	changeRefresh : function(checkbox, newValue, oldValue, eOpts) {
		// 자동 리프레쉬 선택시 타이머 동작 
		if(newValue) {
			this.autoRefreshFlag = true;
			this.refreshAutomatically();
		} else {
			this.autoRefreshFlag = false;
		}
	},
	
	/**
	 * 자동 Refresh 
	 */
	refreshAutomatically : function() {
		if(this.refreshTask) {
			this.refreshTask.cancel();
		}

		this.refreshTask = new Ext.util.DelayedTask(function() {
			if(this.autoRefreshFlag) {
				if(this.viewMode == 'overview') {
					this.refreshFleetMarkers(false);
				} else {
					var gmap = HF.current.view().down('#gmap').gmap;
					this.refreshTripMarkers(gmap, this.fleet);
				}
				
				this.refreshTask.delay(this.refreshInterval);
			}
		}, this);

		this.refreshTask.delay(this.refreshInterval);
	},
	
	/**
	 * Map 초기화
	 */
	initFleetMap : function(fit) {
		var mapItem = HF.current.view().down('#gmap');
		if(!mapItem || !mapItem.gmap) {
			return;
		}
		
		var gmap = mapItem.gmap;
		this.newMap(gmap, new google.maps.LatLng(37.497, 127.528));
		this.refreshFleetMarkers(gmap, fit);
	},
	
	/**
	 * Refresh Fleet Markers
	 */
	refreshFleetMarkers : function(fit) {
		this.viewMode = 'overview';
		var mapItem = HF.current.view().down('#gmap');
		if(!mapItem || !mapItem.gmap) {
			return;
		}
		
		var gmap = mapItem.gmap;
		gmap.setZoom(9);
		this.clearAll();
		
		this.getFleetStore().load({
			scope : this,
			callback : function(records, operation, success) {
				if(success) {
					var me = this, bounds = null;

					Ext.Array.each(records, function(fleet) {
						if(me.checkFleetDisplay(fleet)) {
							bounds = me.markFleet(gmap, bounds, fleet);
						}
					});

					/*if(fit) {
						gmap.fitBounds(bounds);
					}*/
				}
			}
		});
	},

	/**
	 * Fleet Store 가져오기
	 */
	getFleetStore : function() {
		var params = HF.current.view().getParams();
		var fleetStore = Ext.getStore('Trkvue.store.Fleet') ?
						 Ext.getStore('Trkvue.store.Fleet') :
						 Ext.create('Trkvue.store.Fleet');

		var extraParams = params ?
			{
				"_q[id-eq]" : params["fleet"] ? params["fleet"] : '',
				"_q[fleet_group_id-eq]" : params["fleet_group"] ? params["fleet_group"] : ''
			} : null;

		if(extraParams) {
			fleetStore.getProxy().extraParams = extraParams;
		}

		return fleetStore;
	},

	/**
	 * Fleet 표시 여부 체크
	 */
	checkFleetDisplay : function(fleet) {
		var lat = fleet.get('lat');
		var lng = fleet.get('lng');
		return (lat && lat != 0 && lng && lng != 0);
	},
	
	moveToTrip : function(gmap, marker, fleet) {
		//HF.show(Ext.getClassName(HF.current.view()) + 'Item', { fleet : fleet });
		this.initTripMap(gmap, marker, fleet);
	},
	
	/**
	 * Trip Map 초기화
	 */
	initTripMap : function(gmap, marker, fleet) {
		gmap.setCenter(new google.maps.LatLng(fleet.get('lat'), fleet.get('lng')));
		this.refreshTripMarkers(gmap, fleet);
	},

	/**
	 * Refresh Trip Markers
	 */
	refreshTripMarkers : function(gmap, fleet) {
		this.viewMode = 'trip';
		this.fleet = fleet;
		var batchStore = this.getBatchStore(fleet);
		var trackStore = this.getTrackStore(fleet);
		var me = this;

		Trkvue.model.Trip.load(fleet.get('trip_id'), {
			scope : this,
			success : function(trip, operation) {
				batchStore.load({
					scope : this,
					callback : function(batches, operation, success) {
						trackStore.load({
							scope : this,
							callback : function(tracks, operation, success) {
								me.showTrip(gmap, fleet, trip, batches, tracks);
							}
						})
					}
				})
			}
		});
	},

	/**
	 * Batch Store 가져오기
	 */
	getBatchStore : function(fleet) {
		var batchStore = Ext.getStore('Trkvue.store.Batch') ?
						 Ext.getStore('Trkvue.store.Batch') :
						 Ext.create('Trkvue.store.Batch');
		batchStore.getProxy().extraParams = { "_q[tid-eq]" : fleet.get('trip_id') };
		return batchStore;
	},

	/**
	 * Track Store 가져오기
	 */
	getTrackStore : function(fleet) {
		var trackStore = Ext.getStore('Trkvue.store.Track') ?
						 Ext.getStore('Trkvue.store.Track') :
						 Ext.create('Trkvue.store.Track');
		
		trackStore.getProxy().extraParams = { "_q[tid-eq]" : fleet.get('trip_id') };
		return trackStore;
	}
});