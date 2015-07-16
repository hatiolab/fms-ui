json.items do |json|
	json.array!(@collection) do |diy_selection|

		json.(diy_selection, :id, :name, :description, :script_type, :service_logic)

		json.updated_at diy_selection.updated_at
		json.updater diy_selection.updater, :id, :name if diy_selection.updater
	end
end

json.total @total_count
json.success true