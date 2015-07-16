json.items do |json|
	json.array!(@collection) do |common_code|
		json.(common_code, :id, :name, :parent_id, :description)

		json.updated_at common_code.updated_at
		json.updater common_code.updater, :id, :name if common_code.updater
	end
end

json.total @total_count
json.success true
