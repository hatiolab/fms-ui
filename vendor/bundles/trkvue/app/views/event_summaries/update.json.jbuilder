json.(@event_summary, :id,:domain_id,:fleet_id,:sum_day,:sum_year,:sum_month,:sum_week,:impact,:geofence,:emergency,:gsensor,:overspeed)

json.fleet do
	json.id @event_summary.fleet_id
	json.name @event_summary.fleet ? @event_summary.fleet.name : ''
end
