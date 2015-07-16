json.(@variable, :id, :domain_id, :name, :description, :category, :logic)

json.updated_at @variable.updated_at
json.updater @variable.updater, :id, :name if @variable.updater

json.created_at @variable.created_at
json.creator @variable.creator, :id, :name if @variable.creator