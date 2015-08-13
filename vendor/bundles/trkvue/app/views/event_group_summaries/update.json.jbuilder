json.(@event_group_summary, :id,:domain_id,:fleet_group_id,:sum_day,:sum_year,:sum_month,:sum_week,:impact,:geofence,:emergency,:gsensor,:overspeed)

json.fleet_group do
	json.id @event_group_summary.fleet_group_id
	json.name @event_group_summary.fleet_group ? @event_group_summary.fleet_group.name : ''
	json.description @event_group_summary.fleet_group ? @event_group_summary.fleet_group.description : ''
end
