json.(@role, :id, :name, :description)

json.updated_at @role.updated_at
json.updater @role.updater, :id, :name if @role.updater

json.created_at @role.created_at
json.creator @role.creator, :id, :name if @role.creator
