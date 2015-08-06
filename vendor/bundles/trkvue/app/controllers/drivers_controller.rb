class DriversController < ResourceMultiUpdateController

public
	def upload_image
		driver = Driver.find(params[:id])
		driver.img = params[:file]
		driver.save!

    respond_to do |format|
      format.xml  { render :xml => { :success => true, :img => driver.img.url } }
      format.json { render :json => { :success => true, :img => driver.img.url } }
    end
	end
  
private
  def resource_params
    [ params.require(:driver).permit(:code,:name,:social_id,:email,:title,:division,:phone_no,:mobile_no,:address,:img) ]
  end
end
