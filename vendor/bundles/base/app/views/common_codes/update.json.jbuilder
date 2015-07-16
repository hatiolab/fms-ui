@codes = @common_code.codes
json.(@common_code, :id, :name, :description)

json.updated_at @common_code.updated_at
json.updater @common_code.updater, :id, :name if @common_code.updater

json.created_at @common_code.created_at
json.creator @common_code.creator, :id, :name if @common_code.creator

json.items do |json|
	json.array!(@codes) do |code|
  		json.(code, :id, :name, :description)

			json.updated_at code.updated_at
			json.updater code.updater, :id, :name if code.updater
	end
end

json.success true
json.total @codes.count