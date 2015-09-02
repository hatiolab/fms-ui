json.items do |json|
	json.array!(@domains) do |domain|
		json.(domain, :id, :name, :description, :system_flag, :timezone, :lat, :lng)

		json.updated_at domain.updated_at
		json.updater domain.updater, :id, :name if domain.updater

		json.created_at domain.created_at
		json.creator domain.creator, :id, :name if domain.creator
	end
end

json.success true
json.total collection.total_count