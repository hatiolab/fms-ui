json.items do |json|
	json.array!(@collection) do |menu|
		json.(menu, :id, :name, :description, :parent_id, :template, :menu_type, :category, :rank, :icon_path, :hidden_flag)

		json.updated_at menu.updated_at
		json.updater menu.updater, :id, :name if menu.updater
	end
end

json.total @total_count
json.success true