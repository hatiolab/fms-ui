class CodeExpansionsController < ResourceMultiUpdateController
  
private
  def resource_params
    [ params.require(:code_expansion).permit(:expansion_code_id,:data_1,:data_2,:data_3,:data_4,:data_5,:data_6,:data_7,:data_8,:data_9,:data_10) ]
  end
end
