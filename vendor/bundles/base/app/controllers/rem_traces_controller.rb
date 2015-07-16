class RemTracesController < ResourceMultiUpdateController
  
private
  def resource_params
    [ params.require(:rem_trace).permit(:entity_type, :entity_id, :name) ]
  end
end
