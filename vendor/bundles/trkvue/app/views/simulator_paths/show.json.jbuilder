json.(@simulator_path, :id,:domain_id,:name,:description,:paths,:created_at,:updated_at)

json.creator @simulator_path.creator, :id, :name if @simulator_path.creator
json.updater @simulator_path.updater, :id, :name if @simulator_path.updater