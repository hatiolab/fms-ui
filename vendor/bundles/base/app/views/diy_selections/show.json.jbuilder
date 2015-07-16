json.(@diy_selection, :id, :name, :description, :script_type, :service_logic)

json.updated_at @diy_selection.updated_at
json.updater @diy_selection.updater, :id, :name if @diy_selection.updater

json.created_at @diy_selection.created_at
json.creator @diy_selection.creator, :id, :name if @diy_selection.creator

json.service_in_params @diy_selection.service_in_params, :id, :resource_type, :resource_id, :name, :description, :rank
json.service_out_params @diy_selection.service_out_params, :id, :resource_type, :resource_id, :name, :description, :rank
