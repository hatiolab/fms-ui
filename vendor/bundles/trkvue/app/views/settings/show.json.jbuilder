json.(@setting, :id,:domain_id,:global_flag,:name,:description,:value,:created_at,:updated_at)

json.creator @setting.creator, :id, :name if @setting.creator
json.updater @setting.updater, :id, :name if @setting.updater