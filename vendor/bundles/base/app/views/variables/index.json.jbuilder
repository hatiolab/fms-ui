json.items do |json|
	json.array!(@collection) do |variable|
  		json.(variable, :id, :name, :description, :category, :logic)
		
			json.updated_at variable.updated_at
			json.updater variable.updater, :id, :name if variable.updater

			json.created_at variable.created_at
			json.creator variable.creator, :id, :name if variable.creator
	  	
	end
end

json.total @total_count
json.success true