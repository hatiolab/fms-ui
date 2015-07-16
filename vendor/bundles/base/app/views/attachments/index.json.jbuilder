json.items do |json|
	json.array!(@collection) do |attachment|
  	json.(attachment, :id, :name, :description, :path, :file_size, :mimetype, :on_type, :on_id, :tag)
		
		json.url attachment.path.url

		json.updated_at attachment.updated_at
		json.updater attachment.updater, :id, :name if attachment.updater

		json.created_at attachment.created_at
		json.creator attachment.creator, :id, :name if attachment.creator
	end
end

json.total @total_count
json.success true