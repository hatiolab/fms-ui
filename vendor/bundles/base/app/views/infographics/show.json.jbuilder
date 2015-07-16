json.(@infographic, :id, :name, :description, :infographic_type, :printer_type, :diagram, :print_command, :properties)

json.updated_at @infographic.updated_at
json.updater @infographic.updater, :id, :name if @infographic.updater

json.created_at @infographic.created_at
json.creator @infographic.creator, :id, :name if @infographic.creator