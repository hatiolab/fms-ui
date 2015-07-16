json.items do |json|
	json.array!(@collection) do |entity|
		json.(entity, :id, :name, :description, :bundle, :list_infographic, :item_infographic)

		json.updated_at entity.updated_at
		json.updater entity.updater, :id, :name if entity.updater
	end
end

json.total @total_count
json.success true
