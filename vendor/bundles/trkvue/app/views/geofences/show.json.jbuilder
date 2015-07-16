json.(@geofence, :id,:domain_id,:name,:description,:created_at,:updated_at)

json.creator @geofence.creator, :id, :name if @geofence.creator
json.updater @geofence.updater, :id, :name if @geofence.updater