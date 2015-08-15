json.(@fleet_summary, :id,:domain_id,:fleet_id,:driver_id,:sum_day,:sum_year,:sum_month,:sum_week,:velocity,:drive_dist,:drive_time,:impact,:geofence,:emergency,:overspeed,:speed_off,:speed_idle,:speed_slow,:speed_normal,:speed_high,:speed_over)

json.fleet do
	json.id @fleet_summary.fleet_id
	json.name @fleet_summary.fleet ? @fleet_summary.fleet.name : ''
end
