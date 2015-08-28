class DictionariesController < ResourceMultiUpdateController
  
private
  def resource_params
    [ params.require(:dictionary).permit(:name,:description,:locale,:category,:display) ]
  end
end
