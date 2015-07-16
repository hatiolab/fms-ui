class MoviesController < ResourceMultiUpdateController
  
private
  def resource_params
    [ params.require(:movie).permit(:event_id,:total_size,:start_byte,:chunk_size,:chunk_count,:chunk_index,:file_path) ]
  end
end
