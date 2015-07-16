json.items do |json|
	json.array!(@collection) do |diy_service|
  	json.(diy_service, :id, :name, :description, :script_type, :active_flag, :service_logic, :atomic_flag)
		
		json.updated_at diy_service.updated_at
		json.updater diy_service.updater, :id, :name if diy_service.updater
	end
end

json.total @total_count