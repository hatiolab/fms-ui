class SimulatorPathsController < ResourceMultiUpdateController
  
private
  def resource_params
    [ params.require(:simulator_path).permit(:name,:description,:paths) ]
  end
end
