class SettingsController < ResourceMultiUpdateController
  
private
  def resource_params
    [ params.require(:setting).permit(:global_flag,:name,:description,:value) ]
  end
end
