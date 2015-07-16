,:alarm_typejson.(@geofence_group, :id,:fleet_group_id,:geofence_id,:alarm_type,:created_at,:updated_at)

json.creator @geofence_group.creator, :id, :name if @geofence_group.creator
json.updater @geofence_group.updater, :id, :name if @geofence_group.updater