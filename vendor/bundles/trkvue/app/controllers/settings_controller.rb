class SettingsController < ResourceMultiUpdateController
  
protected
  def update_multiple_params(data)
  	data.permit(:global_flag,:name,:description,:value)
  end
  
private
  def resource_params
    [ params.require(:setting).permit(:global_flag,:name,:description,:value) ]
  end
end
