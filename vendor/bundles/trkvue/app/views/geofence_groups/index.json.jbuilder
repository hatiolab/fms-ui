json.items do |json|
	json.array!(@collection) do |geofence_group|
		json.(geofence_group, :id,:fleet_group_id,:geofence_id,:alarm_type,:creator_id,:updater_id,:created_at,:updated_at)
		
		json.fleet_group geofence_group.fleet_group, :id, :name, :description if geofence_group.fleet_group
		json.geofence geofence_group.geofence, :id, :name, :description if geofence_group.geofence
		json.creator geofence_group.creator, :id, :name if geofence_group.creator
		json.updater geofence_group.updater, :id, :name if geofence_group.updater

	end
end
json.total @total_count
json.success true
