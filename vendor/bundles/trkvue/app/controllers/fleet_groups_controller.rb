class FleetGroupsController < ResourceMultiUpdateController
  
private
  def resource_params
    [ params.require(:fleet_group).permit(:name,:description) ]
  end
end
