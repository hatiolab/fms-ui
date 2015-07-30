angular.module('fmsCore').factory('FmsUtils', function($rootScope, $filter, ConstantSpeed) {
	
	return {

		/**
		 * grid container height
		 * 전체 윈도우 Height에서 테이블 제외 Height를 뺀 Height를 설정해준다.
		 */		
		resetAllGridContainerHeight : function() {
			var gridContainers = ['monitor-alert-table-container', 'monitor-fleet-table-container'];
			var me = this;
			angular.forEach(gridContainers, function(gridContainerId) {
				me.setGridContainerHieght(gridContainerId)
			});
		},

		/**
		 * grid container height
		 * 전체 윈도우 Height에서 테이블 제외 Height를 뺀 Height를 설정해준다.
		 */
		setGridContainerHieght : function(gridContainerId) {
			var newHeight = $(window).height();
			var gridContainer = angular.element('#' + gridContainerId);
			if(!gridContainer) {
				return;
			}

			if(gridContainerId == 'monitor-alert-table-container') {
				newHeight = newHeight - 300;

			} else if(gridContainerId == 'monitor-fleet-table-container') {
				newHeight = newHeight - 190;
			}

			if(newHeight > 10) {
				gridContainer.height(newHeight);
			}
		},

		/**
		 * isEmpty
		 */
		isEmpty : function(obj) {
			return (obj == null || !obj) ? true : (!Object.keys(obj).length > 0);
		},

		/**
		 * date format change
		 *
		 * @date
		 * @format
		 */
		formatDate : function(date, format) {
			return $filter("date")(date, format); 
		},

		/**
		 * month period
		 *
		 * @date
		 * @format
		 */
		addDate : function(date, add) {
			date.setDate(date.getDate() + add);
			return date;
		},

		/**
		 * convert date to number
		 * 
		 * @fromDateStr 2015-07-21
		 * @toDateStr 2015-07-25
		 */
		dateToNumber : function(fromDateStr, toDateStr) {
			var toNumber = [];

			if(fromDateStr) {
				toNumber.push(new Date(fromDateStr).getTime());
			}

			if(toDateStr) {
				toNumber.push(this.addDate(new Date(toDateStr), 1).getTime());
			} 

			return toNumber;
		},

		/**
		 * build date conditions
		 * 
		 * @params
		 * @fieldName
		 * @fromDateStr 2015-07-21
		 * @toDateStr 2015-07-25
		 */
		buildDateConds : function(params, fieldName, fromDateStr, toDateStr) {
			// convert date to number
			var dateRange = this.dateToNumber(fromDateStr, toDateStr);

			// from & to date
			if(fromDateStr && toDateStr) {
				params['_q[' + fieldName + '-between]'] = dateRange.join(',');

			// from date
			} else if(fromDateStr && !toDateStr) {
				params['_q[' + fieldName + '-gte]'] = dateRange[0];

			// to date
			} else if(!fromDateStr && toDateStr) {
				params['_q[' + fieldName + '-lte]'] = dateRange[0];
			}
		},

		/**
		 * set speed class to fleet object

		 * @fleets
		 */
		setSpeedClasses : function(fleets) {
			for(var i = 0 ; i < fleets.length ; i++) {
				this.setSpeedClass(fleets[i], fleets[i].velocity);
			}
		},

		setSpeedClass : function(obj, velocity) {
			var level = $rootScope.getSpeedLevel(velocity);

			if(level == ConstantSpeed.SPEED_IDLE) {
				obj.typeClass = 'status-box dark';

			} else if(level == ConstantSpeed.SPEED_SLOW) {
				obj.typeClass = 'status-box blue';

			} else if(level == ConstantSpeed.SPEED_NORMAL) {
				obj.typeClass = 'status-box green';

			} else if(level == ConstantSpeed.SPEED_HIGH) {
				obj.typeClass = 'status-box orange';

			} else if(level == ConstantSpeed.SPEED_OVER) {
				obj.typeClass = 'status-box red';

			} else {
				obj.typeClass = 'status-box gray';
			}
		},

		/**
		 * get speed summaries
		 *
		 * @fleets
		 */
		getSpeedSummaries : function(fleets) {

			var speedSum = {
				speed_off : 0,
				speed_idle : 0,
				speed_slow : 0,
				speed_normal : 0,
				speed_high : 0,
				speed_over : 0
			};

			angular.forEach(fleets, function(fleet) {
				var level = $rootScope.getSpeedLevel(fleet.velocity);

				if(level == ConstantSpeed.SPEED_IDLE) {
					speedSum.speed_idle += 1;

				} else if(level == ConstantSpeed.SPEED_SLOW) {
					speedSum.speed_slow += 1;

				} else if(level == ConstantSpeed.SPEED_NORMAL) {
					speedSum.speed_normal += 1;

				} else if(level == ConstantSpeed.SPEED_HIGH) {
					speedSum.speed_high += 1;

				} else if(level == ConstantSpeed.SPEED_OVER) {
					speedSum.speed_over += 1;

				} else {
					speedSum.speed_off += 1;
				}
			});

			return speedSum;
		},
		
		/**
		 * set event type class to event object

		 * @fleets
		 */
		setEventTypeNames : function(events) {
			for(var i = 0 ; i < events.length ; i++) {
				this.setEventTypeName(events[i]);
			}
		},

		/**
		 * set event type class to event object

		 * @fleets
		 */
		setEventTypeName : function(evt) {
			if(evt.typ == 'I') {
				evt.eventType = 'Geofence (IN)';

			} else if(evt.typ == 'O') {
				evt.eventType = 'Geofence (OUT)';

			} else if(evt.typ == 'G') {
				evt.eventType = 'Impact';

			} else if(evt.typ == 'B') {
				evt.eventType = 'Emergency Button';

			} else if(evt.typ == 'V') {
				evt.eventType = 'Overspeed';
			}
		},

		/**
		 * set event type class to event object

		 * @fleets
		 */
		setEventTypeClasses : function(events) {
			for(var i = 0 ; i < events.length ; i++) {
				this.setEventTypeClass(events[i]);
			}
		},

		/**
		 * set event type class to event object

		 * @fleets
		 */
		setEventTypeClass : function(evt) {
			if(evt.typ == 'I' || evt.typ == 'O') {
				evt.typeClass = 'type-icon geofence-red';

			} else if(evt.typ == 'G') {
				evt.typeClass = 'type-icon impact-red';

			} else if(evt.typ == 'B') {
				evt.typeClass = 'type-icon emergency-red';

			} else if(evt.typ == 'V') {
				evt.typeClass = 'type-icon overspeed-red';
			}
		},

		/**
		 * set alert type class to event object

		 * @fleets
		 */
		setAlertTypeClass : function(evt) {
			if(evt.typ == 'I' || evt.typ == 'O') {
				evt.typeClass = 'type-icon geofence-white';

			} else if(evt.typ == 'G') {
				evt.typeClass = 'type-icon impact-white';

			} else if(evt.typ == 'B') {
				evt.typeClass = 'type-icon emergency-white';

			} else if(evt.typ == 'V') {
				evt.typeClass = 'type-icon overspeed-white';
			}
		},

		/**
		 * get speed summaries
		 *
		 * @fleets
		 */
		getEventTypeSummaries : function(events) {

			var evtTypeSum = {
				geofence : 0,
				impact : 0,
				overspeed : 0,
				emergency : 0
			};

			angular.forEach(events, function(evt) {
				var evtType = evt.typ;

				if(evtType == 'I' || evtType == 'O') {
					evtTypeSum.geofence += 1;

				} else if(evtType == 'G') {
					evtTypeSum.impact += 1;

				} else if(evtType == 'V') {
					evtTypeSum.overspeed += 1;

				} else if(evtType == 'B') {
					evtTypeSum.emergency += 1;
				}
			});

			return evtTypeSum;
		},

		/**
		 * Speed Range Condition
		 */
		getSpeedLangeCondition : function(speedRange, params) {

			if(this.isEmpty(speedRange)) {
				return params;
			}

			var idx = 0;

			if(speedRange.speed_off) {
				params["_q[or][" + idx + "][status-eq]"] = 'OFF';
				idx += 1;
			}

			if(speedRange.speed_idle) {
				params["_q[or][" + idx + "][velocity-eq]"] = 0;
				idx += 1;
			}

			if(speedRange.speed_slow) {
				var range = $rootScope.getSpeedRange(ConstantSpeed.SPEED_SLOW);
				params["_q[or][" + idx + "][velocity-between]"] = range[0] + ',' + range[1];
				idx += 1;
			}

			if(speedRange.speed_normal) {
				var range = $rootScope.getSpeedRange(ConstantSpeed.SPEED_NORMAL);
				params["_q[or][" + idx + "][velocity-between]"] = range[0] + ',' + range[1];
				idx += 1;
			}

			if(speedRange.speed_high) {
				var range = $rootScope.getSpeedRange(ConstantSpeed.SPEED_HIGH);
				params["_q[or][" + idx + "][velocity-between]"] = range[0] + ',' + range[1];
				idx += 1;
			}

			if(speedRange.speed_over) {
				var range = $rootScope.getSpeedRange(ConstantSpeed.SPEED_OVER);
				params["_q[or][" + idx + "][velocity-gt]"] = range;
			}

			return params;
		}

		//------------------------------- E N D ------------------------------------
	};
});
