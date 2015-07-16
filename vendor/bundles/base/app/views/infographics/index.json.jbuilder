json.items do |json|
	json.array!(@collection) do |infographic|
		json.(infographic, :id, :name, :description, :infographic_type, :printer_type, :diagram, :print_command, :properties)

		json.updated_at infographic.updated_at
		json.updater infographic.updater, :id, :name if infographic.updater
	end
end

json.total @total_count
json.success true