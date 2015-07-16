json.items do |json|
	json.array!(@collection) do |terminology|
		json.(terminology, :id, :name, :description, :locale, :category, :display, :display_short)
	
		json.updated_at terminology.updated_at
		json.updater terminology.updater, :id, :name if terminology.updater
	end
end

json.total @total_count
json.success true