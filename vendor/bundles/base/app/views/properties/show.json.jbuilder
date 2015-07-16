json.(@property, :id, :name, :description, :value, :on_type, :on_id, :creator_id, :created_at)

json.updated_at @property.updated_at
json.updater @property.updater, :id, :name if @property.updater

json.created_at @property.created_at
json.creator @property.creator, :id, :name if @property.creator
