/**
 * SimulatorDetail controller
 */
Ext.define('Trkvue.controller.simulator.SimulatorItem', {
	
	extend : 'Frx.controller.ItemController',
	
	requires : [ 
		'Trkvue.model.Simulator', 
		'Trkvue.store.Simulator', 
		'Trkvue.model.SimulatorPath', 
		'Trkvue.store.SimulatorPath', 
		'Trkvue.view.simulator.SimulatorItem'
	],
	
	mixins : [
		'Frx.mixin.lifecycle.FormLifeCycle'
	],
	
	models : ['Trkvue.model.Simulator'],
			
	stores : ['Trkvue.store.Simulator'],
	
	views : ['Trkvue.view.simulator.SimulatorItem'],
	
	init : function() {
		this.callParent(arguments);
		
		this.control({
			'trkvue_simulator_item' : this.EntryPoint(),
			'trkvue_simulator_form' : this.FormEventHandler({
				click_invoke : this.simulate
			})
		});
	},
	
	/****************************************************************
	 ** 					여기는 customizing area 					**
	 ****************************************************************/
	/**
	 * override
	 */
	onAfterLoadItem : function(view, record, operation) {
		if(record.data.id) {
			var fname = view.down('textfield[name=name]');
			if(fname)
				fname.setReadOnly(true);
		}
		
		view.loadRecord(record);
		this.viewChange(view, record);
	},
	
	viewChange : function(view, record) {
		var type = record.get('type');
		
		if(type == 'ROUTES') {
			this.hideFormFields(view, ['textfield[name=lat]', 'textfield[name=lng]', 'numberfield[name=total_count]', 'textfield[name=event_type]', 'textfield[name=severity]']);
			this.showFormFields(view, ['entityfield[name=simulator_path]']);
			
		} else if(type == 'EVENT') {
			this.hideFormFields(view, ['numberfield[name=total_count]', 'entityfield[name=simulator_path]']);
			this.showFormFields(view, ['textfield[name=lat]', 'textfield[name=lng]', 'textfield[name=event_type]', 'textfield[name=severity]']);
			
		} else if(type == 'TRACK') {
			this.hideFormFields(view, ['numberfield[name=total_count]', 'entityfield[name=simulator_path]', 'textfield[name=event_type]', 'textfield[name=severity]']);
			this.showFormFields(view, ['textfield[name=lat]', 'textfield[name=lng]']);
			
		} else if(type == 'STRESS') {
			this.showFormFields(view, ['numberfield[name=simulator_path]', 'entityfield[name=total_count]', 'textfield[name=lat]', 'textfield[name=lng]']);
		}
	},
	
	hideFormFields : function(view, fields) {
		for(var i = 0 ; i < fields.length ; i++) {
			view.down(fields[i]).hide();
		}
	},
	
	showFormFields : function(view, fields) {
		for(var i = 0 ; i < fields.length ; i++) {
			view.down(fields[i]).show();
		}
	},
	
	simulate : function(formView) {
		Trkvue.model.Simulator.load(HF.current.view().getParams().id, {
			scope : this,
			success : function(simulator, operation) {
				var simulData = simulator.data;
				var simulType = simulData.type;
				
				if(simulType == 'TRACK') {
					this.simulateTracking(simulData, simulData.kick_counter, simulData.lat, simulData.lng);
			
				} else if(simulType == 'EVENT') {
					this.simulateEvent(simulData);
			
				} else if(simulType == 'ROUTES') {
					this.simulateRoutes(simulData);
			
				} else if(simulType == 'STRESS') {
					this.simulateStress(simulData);
				}
			}
		});
	},
	
	simulateTracking : function(simulator, counter, lat, lng) {
		if(!simulator.fleet || !simulator.fleet.name) {
			HF.msg.alert({title : 'Alert', msg : 'Fleet ID must not be empty!'});
			return;
		}
		
		var invokeParams = {
			fid : simulator.fleet.name,
			ttm : parseInt(new Date().getTime() / 1000),
			fvr : simulator.fleet_ver ? simulator.fleet_ver : '1.0.0',
			kct : counter ? counter : 1,
			vlc : simulator.velocity ? simulator.velocity : 50,
			lat : lat ? lat : DEFAULT_LAT,
			lng : lng ? lng : DEFAULT_LNG,
			dst : 5,
			gx  : simulator.gx ? simulator.gx : 0.5,
			gy  : simulator.gy ? simulator.gy : 0.5,
			gz  : simulator.gz ? simulator.gz : 0.5,
			url : simulator.url ? simulator.url : 'https://169.53.135.8/api/containers/tracks/upload'
		};
		
		this.invokeCustomService('diy_services/tracking/shoot.json', invokeParams);
	},
	
	simulateEvent : function(simulator) {
		if(!simulator.fleet || !simulator.fleet.name) {
			HF.msg.alert({title : 'Alert', msg : 'Fleet ID must not be empty!'});
			return;
		}
		
		var invokeParams = {
			fid : simulator.fleet.name,
			etm : parseInt(new Date().getTime() / 1000),
			fvr : simulator.fleet_ver ? simulator.fleet_ver : '1.0.0',
			kct : simulator.kick_counter ? simulator.kick_counter : 1,
			vlc : simulator.velocity ? simulator.velocity : 50,
			lat : simulator.lat ? simulator.lat : DEFAULT_LAT,
			lng : simulator.lng ? simulator.lng : DEFAULT_LNG,
			svr : simulator.severity,
			typ : simulator.event_type,
			gx  : simulator.gx ? simulator.gx : 0.5,
			gy  : simulator.gy ? simulator.gy : 0.5,
			gz  : simulator.gz ? simulator.gz : 0.5,
			url : simulator.url ? simulator.url : 'https://169.53.135.8/api/Events/save'
		};
		
		this.invokeCustomService('diy_services/event/shoot.json', invokeParams);
	},
	
	simulateRoutes : function(simulator) {
		Trkvue.model.SimulatorPath.load(simulator.simulator_path_id, {
			scope : this,
			success : function(simulatorPath, operation) {
				var pathStr = simulatorPath.get('paths'), paths = null;
				if(pathStr && pathStr.length > 10) {
					paths = Ext.JSON.decode(pathStr);
					if(paths.length > 0) {
						this.invokeTrackSequencely(simulator, paths);
					}
				}
				
				if(paths == null || paths.length == 0) {
					HF.msg.alert({title : 'Alert', msg : 'Path must not be empty!'});
				}
			}
		});
	},
	
	invokeTrackSequencely : function(simulator, paths) {
		this.refreshInterval = simulator.invoke_cycle ? simulator.invoke_cycle : 3;
		this.refreshInterval = this.refreshInterval * 1000;
		
		if(this.refreshTask) {
			this.refreshTask.cancel();
		}

		var idx = 0, pathCount = paths.length;
		this.refreshTask = new Ext.util.DelayedTask(function() {
			if(pathCount > idx) {
				this.invokePathTrack(simulator, simulator.kick_counter + idx, paths[idx]);
				idx = idx + 1;
				this.refreshTask.delay(this.refreshInterval);
			} else {
				this.refreshTask.cancel();
			}
		}, this);

		this.refreshTask.delay(this.refreshInterval);
	},
	
	invokePathTrack : function(simulator, counter, path) {
		this.simulateTracking(simulator, counter, path.lat, path.lng);
	},
	
	simulateStress : function(simulator) {
		// TODO
	},
	
	/**
	 * TODO JSONP
	 */
	invokeCustomService : function(url, params) {
		Ext.Ajax.request({
			url: url,
			method: 'POST',
			params: params,
			scope : this,
			success: function(response) {
				HF.success(response.responseText);
			}
		});
	}
});