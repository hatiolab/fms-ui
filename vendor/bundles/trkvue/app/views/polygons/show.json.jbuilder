json.(@polygon, :id,:geofence_id,:lat,:lng)

json.creator @polygon.creator, :id, :name if @polygon.creator
json.updater @polygon.updater, :id, :name if @polygon.updater