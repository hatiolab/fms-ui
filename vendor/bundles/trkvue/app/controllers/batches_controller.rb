class BatchesController < MongoController
  
  public
  
  def index
    respond_to do |format|
      format.xml { render :xml => searching(Batch, params) } 
      format.json { render :json => searching(Batch, params) }
    end
  end
  
  def show
    @batch = Batch.find(params[:id])
  end
  
  def update_multiple
    respond_to do |format|
      format.xml { render :xml => update_multiple_data(Batch, params) } 
      format.json { render :json => update_multiple_data(Batch, params) }
    end
  end
  
  private
  
  def resource_params
    [ params.require(:batch).permit(:tid,:stm,:utm,:etm,:vlc,:a_vlc,:dst,:s_lat,:s_lng,:lat,:lng,:c_off,:c_idl,:c_low,:c_nml,:c_hgh,:c_ovr) ]
  end
  
end
