json.(@menu, :id, :name, :description, :parent_id, :template, :menu_type, :category, :rank, :icon_path, :hidden_flag)

json.updated_at @menu.updated_at
json.updater @menu.updater, :id, :name if @menu.updater

json.created_at @menu.created_at
json.creator @menu.creator, :id, :name if @menu.creator