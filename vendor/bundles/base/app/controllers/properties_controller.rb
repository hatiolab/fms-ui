class PropertiesController < ResourceMultiUpdateController
  
private
  def resource_params
    [ params.require(:properties).permit(:name, :description, :value, :on_type, :on_id) ]
  end
end
