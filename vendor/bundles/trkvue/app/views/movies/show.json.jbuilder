json.(@movie, :id,:domain_id,:event_id,:total_size,:start_byte,:chunk_size,:chunk_count,:chunk_index,:file_path,:created_at)

json.creator @movie.creator, :id, :name if @movie.creator
json.updater @movie.updater, :id, :name if @movie.updater