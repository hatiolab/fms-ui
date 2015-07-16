json.items do |json|
	json.array!(@collection) do |role|
		json.(role, :id, :name, :description)

		json.updated_at role.updated_at
		json.updater role.updater, :id, :name if role.updater
	end
end

json.success true
json.total @total_count