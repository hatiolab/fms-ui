json.(@fleet_group_summary, :id,:domain_id,:fleet_group_id,:sum_day,:sum_year,:sum_month,:sum_week,:velocity,:drive_dist,:drive_time,:impact,:geofence,:emergency,:gsensor,:overspeed,:speed_off,:speed_idle,:speed_slow,:speed_normal,:speed_high,:speed_over)

json.fleet_group do
	json.id @fleet_group_summary.fleet_group_id
	json.name @fleet_group_summary.fleet_group ? @fleet_group_summary.fleet_group.name : ''
	json.description @fleet_group_summary.fleet_group ? @fleet_group_summary.fleet_group.description : ''
end
