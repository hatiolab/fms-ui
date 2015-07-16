json.(@terminology, :id, :name, :description, :locale, :category, :display, :display_short)

json.updated_at @terminology.updated_at
json.updater @terminology.updater, :id, :name if @terminology.updater

json.created_at @terminology.created_at
json.creator @terminology.creator, :id, :name if @terminology.creator