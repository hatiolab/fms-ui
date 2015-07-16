json.(@diy_service, :id, :name, :description, :script_type, :active_flag, :service_logic, :atomic_flag)

json.updated_at @diy_service.updated_at
json.updater @diy_service.updater, :id, :name if @diy_service.updater

json.created_at @diy_service.created_at
json.creator @diy_service.creator, :id, :name if @diy_service.creator

json.service_in_params @diy_service.service_in_params, :id, :resource_type, :resource_id, :name, :description, :rank
json.service_out_params @diy_service.service_out_params, :id, :resource_type, :resource_id, :name, :description, :rank
