class VariablesController < ResourceMultiUpdateController

private
  def resource_params
    [ params.require(:variable).permit(:name, :description, :category, :logic) ]
  end
end
