class DriversController < ResourceMultiUpdateController
  
private
  def resource_params
    [ params.require(:driver).permit(:code,:name,:social_id,:email,:title,:division,:phone_no,:mobile_no,:address,:img) ]
  end
end
