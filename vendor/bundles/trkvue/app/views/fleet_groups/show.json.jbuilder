json.(@fleet_group, :id,:domain_id,:name,:description,:created_at,:updated_at)

json.creator @fleet_group.creator, :id, :name if @fleet_group.creator
json.updater @fleet_group.updater, :id, :name if @fleet_group.updater