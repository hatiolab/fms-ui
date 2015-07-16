json.(@attachment, :id, :name, :description, :on_type, :on_id, :tag, :file_size, :mimetype, :path)

json.url @attachment.path.url

json.updated_at @attachment.updated_at
json.updater @attachment.updater, :id, :name if @attachment.updater

json.created_at @attachment.created_at
json.creator @attachment.creator, :id, :name if @attachment.creator
