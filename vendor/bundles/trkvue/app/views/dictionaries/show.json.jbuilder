json.(@dictionary, :id,:domain_id,:name,:description,:locale,:category,:display,:created_at,:updated_at)

json.creator @dictionary.creator, :id, :name if @dictionary.creator
json.updater @dictionary.updater, :id, :name if @dictionary.updater